const { SlashCommandBuilder } = require("discord.js");
const { status } = require("minecraft-server-util");

const SERVER_PORT = 25565; // ポートは固定

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mcstatus")
        .setDescription("現在の環境の Minecraft サーバーステータスを取得するのです！"),
    
    async execute(interaction) {
        const SERVER_IP = interaction.client.SERVER_IP || "127.0.0.1"; // クライアントオブジェクトから取得

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
