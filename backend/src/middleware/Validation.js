//imports project schema
import { createProjectSchema } from "./schemas/projectSchema.js";



const schemas = {
    createProject: createProjectSchema,
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
    const { error, value } = schema.validate(req.body, { abortEarly: false });
if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((e) => e.message),
      });
    }

    //stores clean data for controller 
    //dont use req.body directly in controllers to avoid unvalidated data, this ensures only validated and sanitised data is used in business logic
    req.validatedData = value;
    next();
  };
};

export default validate;// to be used in other parts of app

