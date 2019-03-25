import express from "express";

const appRouter = express.Router();

appRouter.get("/", (_, res) => res.render("home"));

export default appRouter;
