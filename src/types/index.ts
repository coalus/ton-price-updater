import { Context as BaseContext } from "grammy";
import {
  Conversation as BaseConversation,
  ConversationFlavor,
} from "@grammyjs/conversations";
import { DatabaseWorker } from "@/middlewares/database";
import { QueryRunner } from "typeorm";
import { HydrateFlavor } from "@grammyjs/hydrate";

export type Config = {
  bot: {
    token: string;
  };
  api: {
    port: number;
  }
  db: DatabaseConfig;
};

export type Context = HydrateFlavor<BaseContext &
  ConversationFlavor & {
    dbWorker: DatabaseWorker;
    queryRunner: QueryRunner;
  }>;

export type Conversation = BaseConversation<Context>;

export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};
