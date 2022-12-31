const { Client, GuildMember, EmbedBuilder } = require("discord.js")
const DB = require("../../Structures/Schemas/LogsChannel")
const SwitchDB = require("../../Structures/Schemas/GeneralLogs")

module.exports = {
    name: "guildMemberUpdate",

    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client
     */
    async execute(oldMember, newMember, client) {

        const { guild, user } = newMember

        const data = await DB.findOne({ Guild: guild.id }).catch(err => console.log(err))
        const Data = await SwitchDB.findOne({ Guild: guild.id }).catch(err => console.log(err))

        if (!Data) return
        if (Data.MemberBan === false) return
        if (!data) return

        const logsChannel = data.Channel

        const Channel = await guild.channels.cache.get(logsChannel)
        if (!Channel) return

        const oldRoles = oldMember.roles.cache.map(r => r.id)
        const newRoles = newMember.roles.cache.map(r => r.id)

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: "Logged by Electro" })
            .setTimestamp()
            
        if (oldRoles.length > newRoles.length) {

            const RoleID = Unique(oldRoles, newRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle(`<a:ayarlar:815620596669874176> | Üye Güncellemesi`)
                        .setDescription(`**${user.tag}** rolünü kaybetmiş, \`${Role.name}\``)
                ]
            }) 
        } else if (oldRoles.length < newRoles.length) {

            const RoleID = Unique(newRoles, oldRoles)
            const Role = guild.roles.cache.get(RoleID[0].toString())

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle(`<a:ayarlar:815620596669874176> | Üye Güncellemesi`)
                        .setDescription(`**${user.tag}** rolü var, \`${Role.name}\``)
                ]
            }) 
        } else if (newMember.nickname !== oldMember.nickname) {

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle(`<a:ayarlar:815620596669874176> | Takma Ad Güncellemesi`)
                        .setDescription(`**${newMember.user.tag}** rolünü kaybetmiş, \`${oldMember.nickname}\` to \`${newMember.nickname}\` `)
                ]
            }) 
        } else if (!oldMember.premiumSince && newMember.premiumSince) {

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle(`<a:ayarlar:815620596669874176> | Takviye Algılandı`)
                        .setDescription(`**${newMember.user.tag}** sunucuyu güçlendirmeye başladı`)
                ]
            }) 
        } else if (!newMember.premiumSince && oldMember.premiumSince) {

            return Channel.send({
                embeds: [
                    Embed
                        .setTitle(`<a:ayarlar:815620596669874176> | Kaldırma Algılandı`)
                        .setDescription(`**${newMember.user.tag}** sunucuyu güçlendirmeyi bıraktı`)
                ]
            }) 
        }

    }  
}

/**
 * @param {Array} arr1 - First Array
 * @param {Array} arr2 - Second Array
 */
function Unique(arr1, arr2) {

    let unique1 = arr1.filter(o => arr2.indexOf(o) === -1)
    let unique2 = arr2.filter(o => arr1.indexOf(o) === -1)

    const unique = unique1.concat(unique2)

    return unique
}