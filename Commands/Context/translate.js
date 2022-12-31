const { Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require("discord.js")
const translate = require("@iamtraction/google-translate")

module.exports = {
    name: "Translate Message",
    type: ApplicationCommandType.Message,
    context: true,
    category: "Context",

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        
        await interaction.deferReply({ ephemeral: true })

        const { channel, targetId } = interaction

        const query = await channel.messages.fetch({ message: targetId })
        const raw = query.content

        const translated = await translate(query, { to: "tr" })

        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Translation")
                    .addFields([
                        { name: "Standart", value: "```" + raw + "```" },
                        { name: "Türkçe", value: "```" + translated.text + "```" }
                    ])
                    .setFooter({ text: "Translated by Electro" })
                    .setTimestamp()
            ]
        })
    }
}