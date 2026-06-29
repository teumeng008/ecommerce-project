export function errorHandler(err, req, res, next){
    const statusCode = err.statusCode || 500;
    console.error("Error status:", statusCode, "message:", err.message);

    res.status(statusCode).json({success: false, message : err.message || "Internal Server Error" });
}