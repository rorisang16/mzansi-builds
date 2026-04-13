import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).min(3).max(30).required().messages({
    "string.pattern.base": "Username can only contain letters, numbers, underscores and hyphens",
    "string.min": "Username must be at least 3 characters",}),

  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must not exceed 128 characters",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one number"
}),
}).options({ stripUnknown: true });


export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).options({ stripUnknown: true });