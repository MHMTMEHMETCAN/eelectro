const { Client, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "messageCreate",

    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, client) {


        const { author, guild, content } = message
        const { user } = client

        if (!guild || author.bot) return
        if (content.includes("@here") || content.includes("@everyone")) return
        if (!content.includes(user.id)) return

        return message.reply({

            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: user.username, iconURL:user.displayAvatarURL() })
                    .setDescription(`Merhaba Beni Aradın Sanırım? Ben Electro tanıştığımıza memnun oldum Prefix: \`/\` & Logoma Tıklayarak tüm komutlarımı görebilirsin!\n\n*Bu mesaj \`10 saniye\` sonra silinecektir!* `)
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({ text: "Electroya Giriş"})
                    .setTimestamp()
            ],

            components: [
                new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/oauth2/authorize?client_id=797873310000087050&permissions=8&scope=bot")
                        .setLabel("Davet Et"),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://top.gg/bot/797873310000087050")
                        .setLabel("Top.gg")
                )
            ]
        }).then(msg => {

            setTimeout(() => {

                msg.delete().catch(err => {

                    if (err.code !== 10000) return console.log(err)

                })

            }, ms("10s"))
        })
    }
}