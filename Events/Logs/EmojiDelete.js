const { Client, GuildEmoji, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "emojiDelete",

    /**
     * @param {GuildEmoji} emoji
     * @param {Client} client
     */
    async execute(emoji, client) {

        const { guild, id } = emoji

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.EmojiStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`<a:ayarlar:815620596669874176> | Emoji Silindi`)
                    .setDescription(`Sunucudan bir emoji kaldırıldı: ${emoji}, \`${id}\``)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Electro" })
                    .setTimestamp()
            ]
        })
    }
}