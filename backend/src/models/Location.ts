import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

export interface LocationAttributes {
  id: number;
  name: string;
}

interface LocationCreationAttributes
  extends Optional<LocationAttributes, "id"> {}

export class Location
  extends Model<LocationAttributes, LocationCreationAttributes>
  implements LocationAttributes
{
  public id!: number;
  public name!: string;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "locations",
    timestamps: false,
  }
);
