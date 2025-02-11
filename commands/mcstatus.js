const { SlashCommandBuilder } = require("discord.js");
const { status } = require("minecraft-server-util");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mcstatus")
        .setDescription("Minecraftサーバーのステータスを取得する")
        .addStringOption(option =>
            option.setName("ip")
                .setDescription("MinecraftサーバーのIPアドレス")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("port")
                .setDescription("Minecraftサーバーのポート (デフォルト: 25565)")
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const host = interaction.options.getString("ip");
        const port = interaction.options.getInteger("port") || 25565;

        try {
            const response = await status(host, port);
            const embed = {
                color: 0x00ff00,
                title: `🟢 ${host} のステータス`,
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
