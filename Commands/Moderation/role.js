const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")


module.exports = {
    name: "rol",
    description: "Kullanıcıların Rollerini Al yada Ver.",
    UserPerms: ["ManageRoles"],
    BotPerms: ["ManageRoles"],
    category: "Moderation",
    options: [
        {
            name: "options",
            description: "Opsiyonları seç",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Rol Ver",
                    value: "rol-ver"
                },
                {
                    name: "Rol Al",
                    value: "rol-al"
                },
                {
                    name: "Herkese Rol Ver",
                    value: "herkese-rol-ver"
                },
                {
                    name: "Herkesten Rol Al",
                    value: "herkesten-rol-al"
                }
            ]
        },
        {
            name: "rol",
            description: "Yönetilecek rolü seçin",
            type: 8,
            required: true
        },
        {
            name: "kullanıcı",
            description: "Rolleri yönetilecek kullanıcıyı seçin",
            type: 6,
            required: false
        }
    ],
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        await interaction.deferReply({ ephemeral: true })

        const { options, guild, member } = interaction

        const Options = options.getString("options")
        const Role = options.getRole("rol")
        const Target = options.getMember("kullanıcı") || member

        if (guild.members.me.roles.highest.position <= Role.position) return EditReply(interaction, "<:hayr:815620569520406548>",`Bir üye için yönetmeye çalıştığınız bu rol benden daha yüksek!`)

        switch (Options) {

            case "rol-ver": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "<:hayr:815620569520406548>",`Yönetmeye çalıştığınız üye rollerde benden üstün!`)
                if (Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "<:hayr:815620569520406548>",`**${Role.name}** rolü zaten var: ${Target}`)

                await Target.roles.add(Role)

                EditReply(interaction, "<:evet:815620567947280434>",`${Target} şimdi **${Role.name}** rolü var `)
            }
             break;

            case "rol-al": {

                if (guild.members.me.roles.highest.position <= Target.roles.highest.position) return EditReply(interaction, "<:hayr:815620569520406548>",`Yönetmeye bağladığın üye rollerde benden üstün!`)
                if (!Target.roles.cache.find(r => r.id === Role.id)) return EditReply(interaction, "<:hayr:815620569520406548>",`**${Role.name}** rolü yok: ${Target}`)

                await Target.roles.remove(Role)

                EditReply(interaction, "<:evet:815620567947280434>",`${Target} **${Role.name}** rolünü kaybetti`)
            }
             break;

            case "herkese-rol-ver": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "<:evet:815620567947280434>",`${Target} Herkesin **${Role.name}**  rolü var`)

                await Members.forEach(m => m.roles.add(Role))
            }
             break;

            case "herkesten-rol-al": {

                const Members = guild.members.cache.filter(m => !m.user.bot)

                EditReply(interaction, "<:evet:815620567947280434>",`${Target} Herkes **${Role.name}** rolünü kaybetti `)

                await Members.forEach(m => m.roles.remove(Role))
            }
             break;
        }
    }

}