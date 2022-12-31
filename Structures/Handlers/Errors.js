const { Client, EmbedBuilder } = require("discord.js")
const ChannelID = process.env.LOGS

/**
 * @param {Client} client
 */
module.exports = async (client) => {

    const Embed = new EmbedBuilder()
        .setColor(client.color)
        .setTimestamp()
        .setFooter({text: "Anti-Crash by Electro"})
        .setTitle("<a:ayarlar:815620596669874176> | HATA")

    process.on("unhandledRejection", (reason, p) => {

        console.log(reason, p)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                .setDescription("**İşlenmemiş Reddetme/Yakalama: \n\n** ```" + reason + "```")
            ]
        })
    })
    process.on("uncaughtException", (err, origin) => {

        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                .setDescription("**Yakalanmayan İstisna/Yakalama: \n\n** ```" + err + "\n\n" + origin.toString() +"```")
            ]
        })
    })
    process.on("uncaughtExceptionMonitor", (err, origin) => {

        console.log(err, origin)

        const Channel = client.channels.cache.get(ChannelID)
        if (!Channel) return

        Channel.send({
            embeds: [
                Embed
                .setDescription("**Yakalanmayan İstisna/Yakalama (MONITOR): \n\n** ```" + err + "\n\n" + origin.toString() +"```")
            ]
        })
    })
}
