
import CustomError from "../utils/customErrors.js";

//express error middleware(4 parameters tells express that this handles errors)

export const errorHandler = (err, req, res, next) => {
    //logged error for debugging purposes
    console.error(err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"; // default to "error" if status is not set

    //if headers already sent, will delegate to express default handler

    if (res.headersSent) {

        return next(err);
    }

//for showing full details of error only in development


if (process.env.NODE_ENV === "development") {
return res.status(err.statusCode).json({

    success: false, 
    status : err.status,
    message: err.message,
    stack: err.stack, // includes stack trace for debugging
    error: err // includes the full error object for debugging

});
}
// for production - operational errors are safe to show

if (err.isOperational) {
    return res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message
    });
}

// for other unknown errors, does not leak details in production
return res.status(500).json({
    success: false,
    status: "error",
    message: "An unexpected error occurred"
});
};

//404 not found handler
 export const notFoundHandler = (req, res, next) => {
    const error = new CustomError(`Cannot find ${req.originalUrl} on this server`, 404);
    next(error); // pass the error to the error handling middleware
}