const { Client, CommandInteraction, InteractionType, EmbedBuilder } = require("discord.js")
const BlacklistGuildDB = require("../../Structures/Schemas/BlacklistG")
const BlacklistUserDB = require("../../Structures/Schemas/BlacklistU")
const { ApplicationCommand } = InteractionType
const Reply = require("../../Systems/Reply")

module.exports = {
    name: "interactionCreate",

    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction
        
        if (!guild || user.bot) return
        if (type !== ApplicationCommand) return

        const BlackListGuildData = await BlacklistGuildDB.findOne({ Guild: guild.id }).catch(err => { })
        const BlackListUserData = await BlacklistUserDB.findOne({ User: user.id }).catch(err => { })

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(guild.iconURL())
            .setTimestamp()
            .setFooter({ text: "Blacklisted by Electro" })

        const command = client.commands.get(commandName)

        if (!command) return Reply(interaction, "❌", `Komut Çalışırken Bir Hata Oluştu`, true) && client.commands.delete(commandName)

        if (BlackListGuildData) return interaction.reply({
            embeds: [
                Embed
                    .setTitle("Sunucu Kara Listeye Alındı")
                    .setDescription(`Sunucunuz kara listeye alındı <t:${parseInt(BlackListGuildData.Time / 1000)}:R>,\n\n Bu sebepten dolayı: **${BlackListGuildData.Reason}**`)
            ]
        })

        if (BlackListUserData) return interaction.reply({
            embeds: [
                Embed
                    .setTitle("Kullanıcı Kara Listeye Alındı")
                    .setDescription(`Kara listeye alındınız <t:${parseInt(BlackListUserData.Time / 1000)}:R>,\n\n Bu Sebepten dolayı: **${BlackListUserData.Reason}**`)
            ]
        })

            
        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return Reply(interaction, "❌", `Bu Komutu: \`${command.UserPerms.join(", ")}\` Çalıştırmak için İzne İhtiyacın Var`, true)
        if (command.BotPerms && command.BotPerms.length !== 0) if (!member.permissions.has(command.BotPerms)) return Reply(interaction, "❌", `Bu Komutu \`${command.BotPerms.join(", ")}\` Çalıştırmak İçin İzne İhtiyacım Var`, true)

        command.execute(interaction, client)
    }
}