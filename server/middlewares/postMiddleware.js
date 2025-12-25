export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // ✅ logs the full error stack for debugging

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  }

  // Handle cast errors (invalid MongoDB ObjectId, etc.)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
  }

  // Default fallback
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

export default errorHandler
