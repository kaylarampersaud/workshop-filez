import express from "express";
const app = express();
export default app;

import foldersRouter from "#api/folders";
import filesRouter from "#api/files";

// parse incoming JSON data
app.use(express.json());

// mount the routers
app.use("/files", filesRouter);
app.use("/folders", foldersRouter);

// Custom error-handling middleware
// PostgreSQL errors: error messages to the client
app.use((err, req, res, next) => {
  // Unique constraint violation error
  if (err.code === "23505") {
    return res.status(400).send(err.detail);
  }

  next(err);
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
