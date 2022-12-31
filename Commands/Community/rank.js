const { Client, ChatInputCommandInteraction, AttachmentBuilder, EmbedBuilder } = require("discord.js")
const Reply = require("../../Systems/Reply")
const levelDB = require("../../Structures/Schemas/Level")
const Canvacord = require("canvacord")
const { execute } = require("../Utility/activity")

module.exports = {
    name: "rank",
    description: "Derece kartını görüntüler",
    category: "Utility",
    options: [
        {
            name: "kullanıcı",
            description: "bir kullanıcı seçin",
            required: false,
            type: 6
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} = client
     */
    async execute(interaction, client) {

        const { options, user, guild } = interaction

        const Member = options.getMember("user") || user
        const member = guild.members.cache.get(Member.id)

        const Data = await levelDB.findOne({ Guild: guild.id, User: member.id }).catch(err => { })
        if (!Data) return Reply(interaction, "<:hayr:815620569520406548>", `${member} hiç XP kazanmadı!`)

        await interaction.deferReply()

        const Required = Data.Level * Data.Level * 100 + 100

        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forceStatic: true }))
            .setBackground("COLOR", "BLACK")
            .setCurrentXP(Data.XP)
            .setRequiredXP(Required)
            .setRank(1, "Rank", false)
            .setLevel(Data.Level, "Level")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator)
        
        const Card = await rank.build().catch(err => console.log(err))

        const attachment = new AttachmentBuilder(Card, { name: "electrorank.png" })

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`${member.user.username} Rank Card`)
            .setImage("attachment://electrorank.png")
        interaction.editReply({ embeds: [Embed], files: [attachment]})
    }
}