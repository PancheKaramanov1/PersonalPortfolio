const nodeEnv = process.env.NODE_ENV || 'development';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found', path: req.path });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 && nodeEnv === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (status >= 500) {
    console.error('[api]', err);
  }

  res.status(status).json({
    error: message,
    ...(nodeEnv !== 'production' && err.details ? { details: err.details } : {}),
  });
}
