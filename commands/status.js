module.exports = {
	data: {
        name: "ステータス",
        description: "サーバーステータスが分かります",
    },
	async execute(interaction) {
		await interaction.reply('online');
	}
}
