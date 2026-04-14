import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import { ValidationError, NotFoundError, BadRequestError, UnauthorizedError } from '../utils/customErrors.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in ms
const loginAttempts = new Map(); // email --> { count, firstAttempt }

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

class AuthController {

// Registering a new user

async register(req, res, next) {
    try { //extracts username, email. password confirm password from validaed request body
      const { username, email, password, confirmPassword } = req.validatedData;

      //checks if passwords match, if not , bad request error is thrown
      if (password !== confirmPassword) {   
throw new BadRequestError("Passwords do not match");

    }

    //checks if email and username is already in use by querying the database
const existing = await userRepository.getByEmail(email);
if(existing) {
    throw new BadRequestError("Email already in use");}

    const usernameExists = await userRepository.getByUsername(username);
    if (usernameExists) {
      throw new BadRequestError("Username already in use");
    }
//password hashing using bcrypt
     const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ username, email, password: hashedPassword });//creates user with hashed password

    //generates token for the new user
    const token = jwt.sign({userId: user.id}, JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});

//success message + user data
    res.status(201).json({
        success: true, 
        message: "User registered successfully",
        data: {id: user.id, username: user.username, email: user.email},
        token,
    });
    } catch (error) {
        next(error);
    }
}


//functionality for changing password

async changePassword (req, res, next) {
    try {
        const userId = req.userId; // from auth middleware
        const { currentPassword, newPassword,confirmPassword } = req.validatedData; //extracts from validated request body

if (!userId){//checks if user is authenticated

    throw new UnauthorizedError("User not authenticated");
}

//checks if new passwords matches
if (newPassword !== confirmPassword) {
    throw new BadRequestError("New passwords do not match");}

    const user = await userRepository.getById(userId);
if (!user) { //fetches user from database by ID

    throw new NotFoundError("User not found")

}
    
//compares current password with stored hash using bcrypt
const valid = await bcrypt.compare(currentPassword, user.password);
if (!valid) { throw new UnauthorizedError("Current password is incorrect");}

//hashes new password and updates it in db
const hashedPassword = await bcrypt.hash(newPassword, 10);
await userRepository.updatePassword(userId, hashedPassword);

//success message
res.status(200).json({
    success: true,
    message: "Password changed successfully"
});
    } catch (error) {
        next(error);
    }   
}
    async login(req, res, next) {
        try {
            const { email, password } = req.validatedData;
            const attempt = loginAttempts.get(email);
            if (attempt && attempt.count >= MAX_LOGIN_ATTEMPTS) {
                const timeSinceFirst = Date.now() - attempt.firstAttempt;
                if (timeSinceFirst < LOCKOUT_DURATION) {
                    const minutes = Math.ceil((LOCKOUT_DURATION - timeSinceFirst) / 60000);
                    throw new UnauthorizedError(`Account locked. Try again in ${minutes} minutes.`);
                } else {
                    loginAttempts.delete(email);
                }
            }
            const user = await userRepository.getByEmail(email);
            if (!user) {
                let att = loginAttempts.get(email);
                if (!att) { att = { count: 1, firstAttempt: Date.now() }; } else { att.count += 1; }
                loginAttempts.set(email, att);
                throw new UnauthorizedError('Invalid email or password');
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                let att = loginAttempts.get(email);
                if (!att) { att = { count: 1, firstAttempt: Date.now() }; } else { att.count += 1; }
                loginAttempts.set(email, att);
                throw new UnauthorizedError('Invalid email or password');
            }
            loginAttempts.delete(email);
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            res.status(200).json({
                success: true,
                message: "Login successful",
                data: { id: user.id, username: user.username, email: user.email },
                token,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();