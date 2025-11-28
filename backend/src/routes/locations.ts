import { Router } from "express";
import { Location } from "../models/Location";

const router = Router();

router.get("/", async (_req, res) => {
  const locations = await Location.findAll({ order: [["name", "ASC"]] });
  res.json(locations);
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const loc = await Location.create({ name });
  res.status(201).json(loc);
});

router.put("/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  const loc = await Location.findByPk(id);
  if (!loc) return res.status(404).json({ message: "Location not found" });

  loc.name = name ?? loc.name;
  await loc.save();
  res.json(loc);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const loc = await Location.findByPk(id);
  if (!loc) return res.status(404).json({ message: "Location not found" });

  await loc.destroy();
  res.status(204).send();
});

export default router;
