const { Client, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/Warnings")
const EditReply = require("../../Systems/EditReply")
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "uyarı",
    description: "Bir üyenin uyarılarını ekleyin, kaldırın veya kontrol edin",
    UserPerms: ["ManageGuild"],
    category: "Moderation",
    options: [
        {
            name: "ekle",
            description: "bir üyeye uyarı ekler",
            type: 1,
            options: [
                {
                    name: "kullanıcı",
                    description: "kullanıcıyı seçin",
                    type: 6,
                    required: true
                },
                {
                    name: "sebep",
                    description: "Bir sebep sağlayın",
                    type: 3,
                    required: false
                }
            ]
        },   
        {
            name: "kaldır",
            description: "bir üyeyi uyarmayı kaldırır",
            type: 1,
            options: [
                {
                    name: "uyarı-id",
                    description: "Uyarı kimliğini girin",
                    type: 3,
                    required: true
                }
            ]
        },
        {
            name: "listesi",
            description: "Bir üyenin tüm uyarılarını görüntüler",
            type: 1,
            options: [
                {
                    name: "kullanıcı",
                    description: "bir kullanıcı seçin",
                    type: 6,
                    required: true
                }
            ]
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction, client) {
        
        const { options, user, guild } = interaction

        switch (options.getSubcommand()) {

            case "ekle": {

                const Target = options.getMember("kullanıcı")
                const Reason = options.getString("sebep") || "sebep belirtilmedi"

                if (Target.id === user.id) return Reply(interaction, "<:hayr:815620569520406548>", "kendini uyaramazsın")
                if (guild.ownerId === Target.id) return Reply(interaction, "<:hayr:815620569520406548>", "Sunucu Sahibini uyaramazsın!")

                await interaction.deferReply()

                let Data = new DB({

                    User: Target.id,
                    Guild: guild.id,
                    Moderator: user.id,
                    Reason: Reason,
                    Timestamp: Date.now()

                })

                await Data.save()

                EditReply(interaction, "<:evet:815620567947280434>", `${Target} Şu sebepten dolayı uyarıldı : ${Reason}`)
  
            }
                break;

            case "kaldır": {

                await interaction.deferReply()

                const WarnID = options.getString("uyarı-id")

                const Data = await DB.findOne({ _id: WarnID }).catch(err => { })
                if (!Data) return EditReply(interaction, "<:hayr:815620569520406548>", "Sağladığınız kimlik geçerli değil!")

                const Member = guild.members.cache.get(Data.User)

                await Data.delete()

                EditReply(interaction, "<:evet:815620567947280434>", `${Member} Uyarısı Kaldırıldı`)
  
            }
                break;   
                
            case "listesi": {

                await interaction.deferReply()

                const Target = options.getMember("kullanıcı")
                if (!Target) return EditReply(interaction, "<:hayr:815620569520406548>", "Üye mevcut değil")

                const UserWarns = await DB.find({ User: Target.id, Guild: guild.id }).catch(err => { })
                if (UserWarns.length === 0) return Reply(interaction, "<:hayr:815620569520406548>", "Üyenin herhangi bir uyarısı yok")

                const Mapped = UserWarns.map(warn => {

                    return `\`${warn._id}\` | ${warn.Reason}`
                }).join("\n")
                
                const Embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`${Mapped}`)

                interaction.editReply({ embeds: [Embed] })

            }
                break;
        }
    }
}