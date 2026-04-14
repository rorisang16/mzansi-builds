import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/customErrors.js';

const JWT_SECRET = process.env.JWT_SECRET;

//JWT authentication middleware
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;//extracts authorisation header 

    //checks if header ecists and starts with "bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError("No token provided");
    }

    //Extracts token from "Bearer <token>"
    const token = authHeader.split(' ')[1];//splits the header and gets the actual token string

    //Verifies token  using jwt library
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attaches user id to the request
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
};

export default authenticate;