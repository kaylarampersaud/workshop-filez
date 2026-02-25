import express from "express";
const router = express.Router();
export default router;

import { createFile } from "#db/queries/files";
import { getFolderByIdIncludingFiles, getFolders } from "#db/queries/folders";

// GET /folders
router.get("/", async (req, res) => {
  const folders = await getFolders();
  res.send(folders);
});

router.param("id", async (req, res, next, id) => {
  const folder = await getFolderByIdIncludingFiles(id);
  // Sends 404 error message if folder doesn't exist
  if (!folder) return res.status(404).send("Folder not found.");

  req.folder = folder;
  next();
});

// GET /folders/:id
router.get("/:id", (req, res) => {
  res.send(req.folder);
});

// POST /folders/:id/files
router.post("/:id/files", async (req, res) => {
  // Sends 400 if request body is not provided
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, size } = req.body;
  if (!name || !size)
    // Sends 400 if request body is missing required fields
    return res.status(400).send("Request body requires: name, size");

  const file = await createFile(name, size, req.folder.id);
  res.status(201).send(file);
});
