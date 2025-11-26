import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./models/Location";
import "./models/Inventory";
import { sequelize } from "./db";
// import inventoriesRouter from './routes/inventories';
// import locationsRouter from './routes/locations';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use('/inventories', inventoriesRouter);
// app.use('/locations', locationsRouter);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed", error);
    process.exit(1);
  }
}

start();
