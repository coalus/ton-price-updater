import { DataSource } from "typeorm";
import { DatabaseConfig } from "@/types";
import { Channel } from "./models/channel";

export const getDataSource = (config: DatabaseConfig): DataSource => {
  const dataSource = new DataSource({
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
    database: config.database,
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
    entities: [Channel],
  });

  return dataSource;
};
