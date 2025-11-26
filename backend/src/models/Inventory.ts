import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import { Location } from "./Location";

export interface InventoryAttributes {
  id: number;
  name: string;
  price: number;
  locationId: number;
}

interface InventoryCreationAttributes
  extends Optional<InventoryAttributes, "id"> {}

export class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public locationId!: number;
}

Inventory.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Location,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "inventories",
    timestamps: false,
  }
);

Location.hasMany(Inventory, { foreignKey: "locationId" });
Inventory.belongsTo(Location, { foreignKey: "locationId" });
