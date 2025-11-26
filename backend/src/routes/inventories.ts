import { Router } from "express";
import { Inventory } from "../models/Inventory";
import { Location } from "../models/Location";
import { Op, literal } from "sequelize";

const router = Router();

router.get("/", async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const offset = (page - 1) * limit;

  const locationId = req.query.locationId
    ? Number(req.query.locationId)
    : undefined;
  const sortBy = (req.query.sortBy as string) || "name";
  const sortDir = (req.query.sortDir as string) === "desc" ? "DESC" : "ASC";

  const where: any = {};
  if (locationId) {
    where.locationId = locationId;
  }

  let order: any = [["name", sortDir]];
  if (sortBy === "price") {
    order = [["price", sortDir]];
  } else if (sortBy === "location") {
    order = [[Location, "name", sortDir]];
  }

  const { rows, count } = await Inventory.findAndCountAll({
    where,
    include: [{ model: Location, attributes: ["id", "name"] }],
    order,
    limit,
    offset,
  });
  res.json({
    items: rows,
    total: count,
    page,
    pageSize: limit,
  });
});

router.get("/stats", async (_req, res) => {
  const stats = await Inventory.findAll({
    attributes: [
      "locationId",
      [literal("COUNT(*)"), "totalCount"],
      [literal("SUM(price)"), "totalPrice"],
    ],
    include: [{ model: Location, attributes: ["name"] }],
    group: ["locationId", "Location.id"],
    order: [[Location, "name", "ASC"]],
  });

  res.json(
    stats.map((row: any) => ({
      cinema: row.Location.name,
      totalCount: Number(row.get("totalCount")),
      totalPrice: Number(row.get("totalPrice")),
    }))
  );
});

router.post("/", async (req, res) => {
  const { name, price, locationId } = req.body;

  if (!name || price == null || !locationId) {
    return res
      .status(400)
      .json({ message: "name, price, locationId are required" });
  }

  const loc = await Location.findByPk(locationId);
  if (!loc) {
    return res.status(400).json({ message: "Invalid locationId" });
  }

  const inv = await Inventory.create({
    name,
    price,
    locationId,
  });

  res.status(201).json(inv);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const inv = await Inventory.findByPk(id);

  if (!inv) return res.status(404).json({ message: "Inventory not found" });

  await inv.destroy();
  res.status(204).send();
});

export default router;
