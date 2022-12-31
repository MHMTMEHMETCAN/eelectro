const { Client, Role, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "roleCreate",

    /**
     * @param {Role} role
     * @param {Client} client
     */
    async execute(role, client) {

        const { guild, id } = role

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.RoleStatus === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        return Channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle(`<a:ayarlar:815620596669874176> | Rol Oluşturuldu`)
                    .setDescription(`Şu adlı bir Rol oluşturuldu: ${role}, \`${name}\``)
                    .setThumbnail(guild.iconURL())
                    .setFooter({ text: "Logged by Electro" })
                    .setTimestamp()
            ]
        })
    }
}