const { Client, GatewayIntentBits } = require("discord.js");
const fs = require('fs')
const axios = require("axios"); // axios を使う
require("dotenv").config(); // 環境変数を使う場合

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const commands = {}
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands[command.data.name] = command
}

let SERVER_IP = "127.0.0.1";

client.once("ready", async () => {
  const data = []
  for (const commandName in commands) {
      data.push(commands[commandName].data)
  }
  await client.application.commands.set(data,);
  console.log("Bot準備完了！");

  try {
    const response = await axios.get("https://ipinfo.io/json");
    SERVER_IP = response.data.ip; // 取得したIPを変数に格納
    client.SERVER_IP = SERVER_IP; // クライアントオブジェクトにも保存

    client.user.setPresence({
      activities: [{ name: `IP: ${SERVER_IP}`, type: 4 }],
      status: "online",
    });

    console.log(`IPアドレスをステータスに設定: ${SERVER_IP}`);
  } catch (error) {
    console.error("IPアドレスの取得に失敗しました:", error);
  }
});
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = commands[interaction.commandName];
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
