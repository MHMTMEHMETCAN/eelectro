const { Client, ModalSubmitInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ModalSubmitInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { type, customId, channel, guild, user, fields } = interaction

        if (type !== InteractionType.ModalSubmit) return
        if (!guild || user.bot) return

        if (customId !== "announce-modal") return

        await interaction.deferReply({ ephemeral: true })

        const messageInput = fields.getTextInputValue("message-input")

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle("Yeni Duyuru")
            .setThumbnail(guild.iconURL())
            .setDescription(messageInput)
            .setTimestamp()

        EditReply(interaction, "<a:yess:815620614983122974>", `Duyuru şimdi şurada yayınlandı ${channel}`)

        channel.send({ embeds: [Embed] }).then(async msg => {

            await msg.react("<:evet:815620567947280434>")
            await msg.react("<:hayr:815620569520406548>")
        })
    }
}