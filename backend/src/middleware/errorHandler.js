function notFound(req, res) {
  res.status(404).json({success: false, message: `Route not found: ${req.originalUrl}`});
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({success: false, message: 'That record already exists.'});
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
  });
}

module.exports = {notFound, errorHandler};
