//imports project schema
import { createProjectSchema } from "./schemas/projectSchema.js";
import { createCommentSchema } from "./schemas/commentSchema.js";
import { registerSchema, loginSchema, changePasswordSchema } from "./schemas/authSchema.js";
// O(1) Lookup for schemas by key,which allows validate middleware to be flexible and work for different routes
const schemas = {
    createProject: createProjectSchema,
    createComment: createCommentSchema,
 register: registerSchema,
  login: loginSchema,
  changePassword: changePasswordSchema,
  }


//validation middleware function that validates incoming request data against the defined Joi schemas
//this returns a middleware function - higher order function ( a function that returns a function) , makes middleware more reusable + configurable
const validate = (schemaKey) => { 
  return (req, res, next) => {
    const schema = schemas[schemaKey];//looks up correct schema by name - O(1) time complexity for lookup

    if (!schema) {
      return next(new Error(`Schema '${schemaKey}' not found`));
    }
//abortearly means all errors will be collected and returned together instead of stopping at the first error, this provides better feedback to the client about all validation issues in one response
    // Guard: if req.body wasn't parsed (missing Content-Type or body parser issue) fail early
    if (req.body === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Request body is required'],
      });
    }
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((e) => e.message),
      });
    }

    //stores clean data for controller 
    //does not use req.body directly in controllers to avoid unvalidated data, this ensures only validated and sanitised data is used in business logic
    req.validatedData = value;
    next();
  };
};

export default validate;// to be used in other parts of app

