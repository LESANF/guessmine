import "./env";
import "./db";
import { join } from "path";
import express from "express";
import { listen } from "socket.io";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 4000;

const app = express();
app.set("view engine", "pug");
app.use(express.static(join(__dirname, "public")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const handleListening = () =>
  console.log(`✅  Server running on http://localhost:${PORT}`);

const server = app.listen(process.env.PORT, handleListening);

const io = listen(server);
