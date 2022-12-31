const { Client, Guild, User, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "guildBanAdd",

    /**
     * @param {Guild} guild
     * @param {User} user
     * @param {Client} client
     */
    async execute(guild, user, client) {

        const { id, username, discriminator } = user

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.MemberBan === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`<a:ayarlar:815620596669874176> | Kullanıcı Yasaklandı`)
                    .setDescription(`**${username}#${discriminator}** (${id}) sunucudan yasaklandı`)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Electro" })
                    .setTimestamp()
            ]
        })
    }
}