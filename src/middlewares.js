export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Guess Mine";
  res.locals.user = req.user || null;
  next();
};
