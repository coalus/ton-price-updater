import * as dotenv from "dotenv";

import { Bot, InputFile, session } from "grammy";
import { run } from "@grammyjs/runner";
import { conversations} from "@grammyjs/conversations";
import { hydrate } from "@grammyjs/hydrate";
import { loadConfigFromEnv } from "./config";
import { Context } from "./types";
import { DatabaseMiddleware } from "./middlewares/database";
import { getDataSource } from "./db";
import { Channel } from "./db/models/channel";

dotenv.config();

async function runApp() {
  console.log("Starting app...");

  const config = loadConfigFromEnv();
  const dataSource = getDataSource(config.db);
  await dataSource
    .initialize()
    .then(() => console.log("Database initialized"))
    .catch((err) => {
      throw new Error(`Database initialization failed with error:\n${err}`);
    });

  const dbMiddleware = new DatabaseMiddleware(dataSource);
  const bot = new Bot<Context>(config.bot.token);

  bot
    .use(
      session({
        initial() {
          return {};
        },
      }),
    )
    .use(conversations())
    .use(hydrate())
    .use(dbMiddleware.handle.bind(dbMiddleware))

  bot.command('start', async (ctx) => {
    await ctx.replyWithPhoto(new InputFile('./src/public/permissions.png'), {caption: "Hey!\nAdd this bot to the admins of your channel/chat and it will start providing an up to date rate of $TON in its description!\n\n<b>WARNING: YOU MUST give the bot 'Change Group Info' permissions.</b>", parse_mode: "HTML"});
  })

  bot.on('my_chat_member', async (ctx) => {
    if (ctx.update.my_chat_member.new_chat_member.status == 'administrator' && ctx.update.my_chat_member.new_chat_member.can_change_info) {
      const channel = new Channel();
      channel.id = ctx.update.my_chat_member.chat.id.toString();
      console.log('Added new channel: ', ctx.update.my_chat_member.chat.username, ctx.update.my_chat_member.chat.id)
      await channel.save();
     }
     if (!['administrator', 'creator'].includes(ctx.update.my_chat_member.new_chat_member.status)) {
      const channel = await Channel.findOneBy({id: ctx.update.my_chat_member.chat.id.toString()});
      if (channel) {
        console.log('Deleted channel: ', ctx.update.my_chat_member.chat.username, ctx.update.my_chat_member.chat.id)
        await channel.remove();
      }
     }
  })

  setInterval(async () => {
    const API_URL = 'https://ton.org/api/toncoinInfo';
    const tonPrice = await fetch(
      API_URL
    )
    const data = await tonPrice.json()
    const text = `TON = $${data.price.toFixed(2)}`
    const channels = await Channel.find();
    for (const channel of channels) {
      console.log('Trying to update ', channel.id, ' description..')
      const prevText = (await bot.api.getChat(channel.id)).description?.trim()
      let newText = (text + '\n' + (prevText ?? '')).trim()
      if (prevText?.startsWith('TON = $')) {
        newText = (text + '\n' + (prevText.split('\n')[1] ?? '')).trim()
      }
      console.log('Prev text:')
      console.log(prevText)
      console.log("New text:")
      console.log(newText)
      if (newText != prevText)
        try {
          await bot.api.setChatDescription(channel.id, newText)
        } catch (e) {
          console.log("Error while trying to set new ", channel.id, ' description')
        }
        
    }
  }, 1000 * 60 * 30); // 30 min

  await bot.init();

  run(bot);

  console.info(`Bot @${bot.botInfo.username} is up and running`);
}

void runApp()