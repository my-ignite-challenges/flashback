import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { resolve } from "node:path";

import { authRoutes } from "./routes/auth";
import { memoriesRoutes } from "./routes/memories";
import { uploadRoutes } from "./routes/upload";
import { jwtSecret } from "../src/utils/secrets";

const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: jwtSecret,
});

app.register(memoriesRoutes);
app.register(authRoutes);
app.register(uploadRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => console.log("Server is listening!🚀🚀🚀"));
