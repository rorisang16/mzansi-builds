import Joi  from "joi";

export const createProjectSchema = Joi.object({ //joi.object defines what data must look like
    title: Joi.string().min(3).max(100).required().messages({
        //these are custom error messages that are more human readable versus using jois default ones
        "string.min": "Title must be at least 3 characters",
        "string.max": "Title must not exceed 100 characters",
        "any.required": "Title is required",
    }),

    description: Joi.string().min(10).max(500).required()
    .messages({
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description must not exceed 500 characters",
      "any.required": "Description is required",
    }),
  stage: Joi.string()
    .valid("ideation", "development", "testing")
    .required()
    .messages({
      "any.only": "Stage must be ideation, development or testing",
      "any.required": "Stage is required",
    }),
     status: Joi.string()
    .valid("active", "completed")
    .default("active"),
});