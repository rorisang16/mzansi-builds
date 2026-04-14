import Joi from 'joi';

//schema validation using JOI for comment creation
export const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required().messages({
    "string.min": "Comment cannot be empty",
    "string.max": "Comment must not exceed 500 characters",
    "any.required": "Comment content is required",
  }),
}).options({ stripUnknown: true }) 
//this strips unknown fields to prevent mass assignmemt attacks