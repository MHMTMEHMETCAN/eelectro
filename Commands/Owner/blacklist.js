const { Client, ChatInputCommandInteraction, InteractionCollector } = require("discord.js")
const DBG = require("../../Structures/Schemas/BlacklistG")
const DBU = require("../../Structures/Schemas/BlacklistU")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "blacklist",
    description: "Bir sunucuyu veya üyeyi bot kullanmaktan kara listeye alır",
    UserPerms: ["Administrator"],
    BotPerms: ["Administrator"],
    category: "Owner",
    options: [
        {
            name: "options",
            description: "Bir seçenek seçin",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Sunucu",
                    value: "server"
                },
                {
                    name: "Üye",
                    value: "member"
                },
            ]
        },
        {
            name: "id",
            description: "Kullanıcının veya sunucunun kimliğini sağlayın",
            type: 3,
            required: true
        },
        {
            name: "reason",
            description: "Bir sebep sağlayın",
            type: 3,
            required: false
        }
    ],

    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { user, options } = interaction

        if (user.id !== "730096504647188531") return EditReply(interaction, "<:hayr:815620569520406548>", `Malesef bu Komudu Kullanamazsın`)

        const Options = options.getString("options")
        const ID = options.getString("id")
        const Reason = options.getString("reason") || "sebep belirtilmedi"

        if (isNaN(ID)) return EditReply(interaction, "<a:no:815620616882487296>", `Kimliğin bir sayı olması gerekiyordu`)

        switch (Options) {
            
            case "server": {
                
                const Guild = client.guilds.cache.get(ID)

                let GName
                let GID

                if (Guild) {

                    GName = Guild.name
                    GID = Guild.id

                } else {

                    GName = "Unknown"
                    GID = ID
                }

                let Data = await DBG.findOne({ Guild: GID }).catch(err => { })

                if (!Data) {

                    Data = new DBG({
                        Guild: GID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "<a:yess:815620614983122974>", `Başarıyla Eklendi **${GName} (${GID})** kara listeye alınan sunucularda şu nedenle: **${Reason}**`)

                } else {
                    
                    await Data.delete()

                    EditReply(interaction, "<a:yess:815620614983122974>", `Başarıyla kaldırıldı **${GName} (${GID})** kara listeye alınan sunuculardan`)

                }
            }
                break;

            case "member": {

                let Member
                let MName
                let MID

                const User = client.users.cache.get(ID)

                if (User) {

                    Member = User
                    MName = User.tag
                    MID = user.id

                } else {

                    Member = "Unknown User #0000"
                    MName = "Unknown User #0000"
                    MID = ID

                }

                let Data = await DBU.findOne({ User: MID }).catch(err => console.log(err))

                if (!Data) {

                    Data = new DBU({
                        User: MID,
                        Reason,
                        Time: Date.now()
                    })

                    await Data.save()

                    EditReply(interaction, "<a:yess:815620614983122974>", `Başarıyla Eklendi **${Member} (${MName} | ${MID})** şu nedenle kara listeye alınan üyelerde: **${Reason}**`)

                } else {

                    await Data.delete()

                    EditReply(interaction, "<a:yess:815620614983122974>", `Başarıyla kaldırıldı **${Member} (${MName} | ${MID})** kara listedeki üyelerden**${Reason}**`)
                }
            }
        }
    }
}