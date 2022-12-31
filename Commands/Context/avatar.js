const { Client, ContextMenuCommandInteraction, ApplicationCommandType, EmbedBuilder } = require("discord.js")

module.exports = {
    name: "Avatar",
    type: ApplicationCommandType.User,
    context: true,
    category: "Context",

    /**
     * @param {ContextMenuCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        await interaction.deferReply()

        const { guild, targetId } = interaction

        const target = await guild.members.cache.get(targetId)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: `${target.user.username} Avatar`, iconURL: target.user.displayAvatarURL() })
            .setImage(target.user.displayAvatarURL({ size: 512 }))
            .setFooter({ text: "Avatar by Electro" })
            .setTimestamp()
        
        return interaction.editReply({ embeds: [Embed] })    
    }
}