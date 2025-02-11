const { SlashCommandBuilder } = require("discord.js");
const { status } = require("minecraft-server-util");

const SERVER_IP = "192.168.1.1";  // 固定IP
const SERVER_PORT = 25565;        // 固定ポート

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mcstatus")
        .setDescription("Minecraftサーバーのステータスを取得するのです！"),
    
    async execute(interaction) {
        try {
            const response = await status(SERVER_IP, SERVER_PORT);
            const embed = {
                color: 0x00ff00,
                title: `🟢 ${SERVER_IP} のステータス`,
                fields: [
                    { name: "プレイヤー数", value: `${response.players.online} / ${response.players.max}`, inline: true },
                    { name: "バージョン", value: response.version.name, inline: true },
                    { name: "MOTD", value: response.motd.clean, inline: false },
                ],
                timestamp: new Date(),
            };
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply("❌ サーバーに接続できませんでした！");
        }
    }
};
