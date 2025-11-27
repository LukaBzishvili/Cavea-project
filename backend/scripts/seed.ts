import dotenv from "dotenv";
dotenv.config();

import { sequelize } from "../src/db";
import { Location } from "../src/models/Location";
import { Inventory } from "../src/models/Inventory";

const DEFAULT_COUNT = 500000;

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const locations = [
      "Main Office",
      "Cavea Galleria",
      "Cavea Tbilisi Mall",
      "Cavea East Point",
      "Cavea City Mall",
    ];

    const existing = await Location.findAll();
    let locationRecords: Location[] = [];

    if (existing.length === 0) {
      locationRecords = await Location.bulkCreate(
        locations.map((name) => ({ name })),
        { returning: true }
      );
    } else {
      locationRecords = existing;
    }

    const count = Number(process.env.SEED_COUNT ?? DEFAULT_COUNT);

    console.log(`Seeding ${count} inventories...`);

    const batches: any[] = [];
    const batchSize = 5000;
    for (let i = 0; i < count; i++) {
      const loc =
        locationRecords[Math.floor(Math.random() * locationRecords.length)];
      batches.push({
        name: `Item ${i + 1}`,
        price: Math.floor(Math.random() * 1000) + 1,
        locationId: loc.id,
      });
      if (batches.length === batchSize) {
        await Inventory.bulkCreate(batches);
        batches.length = 0;
        console.log(`Inserted ${i + 1}/${count}`);
      }
    }
    if (batches.length > 0) {
      await Inventory.bulkCreate(batches);
    }

    console.log("Seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seed error", err);
    process.exit(1);
  }
}

seed();
