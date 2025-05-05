import { Config } from "@/types";
import * as dotenv from "dotenv";

dotenv.config();

export const loadConfigFromEnv = (): Config => {
  if (!process.env.BOT_TOKEN) {
    throw new Error("Bot token is not found");
  }

  return {
    bot: {
      token: process.env.BOT_TOKEN,
    },
    db: {
      host: process.env.POSTGRES_HOST ?? "localhost",
      port: process.env.POSTGRES_PORT
        ? parseInt(process.env.POSTGRES_PORT)
        : 5432,
      user: process.env.POSTGRES_USER ?? "",
      password: process.env.POSTGRES_PASSWORD ?? "",
      database: process.env.POSTGRES_DB ?? "",
    },
    api: {
      port: Number(process.env.API_PORT),
    }
  };
};
