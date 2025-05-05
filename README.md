### Installation and local launch

1. Clone the repo <br />
```
git clone git@github.com:ton-developers/ton-society-id-bot.git
```

2. Install the dependencies<br />
```
npm i
```

3. Spin up a local instance of the PostgreSQL and update the corresponding variables in your `.env`. For example, via `docker-compose.yml` or docker image as follows:
```
docker run --name support-bot-postgres -e POSTGRES_PORT=5433 -e POSTGRES_DB=postgres -e POSTGRES_USER=user -e POSTGRES_PASSWORD=hBVxc9Lv3YAJD7RGwI01jrK2MKO1UGPf -d -p 5433:5432 postgres
```

4. Configure Telegram channel and group for the support bot:
- Create a channel
- Create a group
- Link the channel to the group (see "Edit" in the channel settings)
- Create a bot and add it to the channel and the group
- Give the bot admin permissions
Set channel and group telegram ids in the `.env`

5. Launch the application
```
npm start
```
After any changes the app should be restarted.

Trigger `/start` command in the bot.
