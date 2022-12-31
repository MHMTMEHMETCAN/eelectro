const { Client, MessageComponentInteraction, InteractionType } = require("discord.js")
const DB = require("../../Structures/Schemas/Verification")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {MessageComponentInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { guild, customId, member, type } = interaction

        if (type !== InteractionType.MessageComponent) return

        const CustomID = ["doğrulama"]
        if (!CustomID.includes(customId)) return

        await interaction.deferReply({ ephemeral: true })

        const Data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        if (!Data) return EditReply(interaction, "<:yapmabe:972771345345703946>", "Verilerimi Bulamadım :/")

        const Role = guild.roles.cache.get(Data.Role)

        if (member.roles.cache.has(Role.id)) return EditReply(interaction, "<:hayr:815620569520406548>", "Üye Olarak Zaten Doğrulandın")

        await member.roles.add(Role)

        EditReply(interaction, "<a:yesiltik:972770457562546206>","Üye Olarak Doğrulandın")
    }
}