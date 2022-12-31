const { Client, ChatInputCommandInteraction, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/Verification")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "doğrulama",
    description: "Dahili Doğrulama Sistemi",
    UserPerms: ["ManageGuild"],
    category: "Moderation",
    options: [
        {
            name: "rol",
            description: "Doğrulanmış Üyeler Rolünü Seçin",
            type: 8,
            required: true
        },
        {
            name: "kanal",
            description: "Sistemin gönderileceği Kanalı seçin",
            type: 7,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, channel } = interaction

        const role = options.getRole("rol")
        const Channel = options.getChannel("kanal") || channel

        let Data = await DB.findOne({ Guild: guild.id }).catch(err => { })

        if (!Data) {

            Data = new DB({
                Guild: guild.id,
                Role: role.id
            })

            await Data.save()
       
        } else {
            
            Data.Role = role.id
            await Data.save()

        }

        Channel.send({

            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle("Doğrulama")
                    .setDescription("Doğrulamak için düğmeye tıklayın")
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("doğrulama")
                        .setLabel("Tıkla")
                        .setStyle(ButtonStyle.Secondary)
                )
            ]
        })

        return EditReply(interaction, "<a:yesiltik:972770457562546206>", `Doğrulama Paneli Başarıyla ${Channel} Gönderildi`)
    }
}