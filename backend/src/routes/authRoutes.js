import express from 'express';
import authController from '../controllers/authController.js';
import validate from '../middleware/validation.js';
import authenticate from '../middleware/authenticate.js';
import { registerSchema, loginSchema, changePasswordSchema } from '../middleware/schemas/authSchema.js';



const router = express.Router();

//registration endpoint
router.post('/register', validate('register'), authController.register);

//login endpoint
router.post('/login', validate('login'), authController.login);

//change password endpoint (protected)
router.post('/change-password', authenticate, validate('changePassword'), authController.changePassword);

export default router;