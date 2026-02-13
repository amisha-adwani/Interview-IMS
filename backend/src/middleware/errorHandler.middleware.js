export const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(e => e.message).join('. ');
    return res.status(400).json({ success: false, message });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ 
      success: false, 
      message: `${field} already exists` 
    });
  }
  
  // Default 
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message 
  });
};
