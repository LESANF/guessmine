import events from "./events";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Guess Mine";
  res.locals.events = JSON.stringify(events);
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/");
  }
};
