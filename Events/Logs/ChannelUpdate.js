const { Client, TextChannel, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "channelUpdate",

    /**
     * @param {TextChannel} oldChannel
     * @param {TextChannel} newChannel
     * @param {Client} client
     */
    async execute(oldChannel, newChannel, client) {

        const { guild } = newChannel

        const data = await DB.findOne({ Guild: guild.id }).catch(err => { })
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.ChannelStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        if (oldChannel.topic !== newChannel.topic) {

            return Channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(client.color)
                        .setTitle(`<a:ayarlar:815620596669874176> | Kanal Güncellemesi`)
                        .setDescription(`${newChannel}adlı kanalın konusu değiştirildi ** ${oldChannel.topic}** => **${newChannel.topic}**`)
                        .setThumbnail(guild.iconURL())
                        .setFooter({ text: "Logged by Electro" })
                        .setTimestamp()
                ]
            })
        }
    }
}