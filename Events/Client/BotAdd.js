const { Client, Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder } = require("discord.js")
const ms = require("ms")

module.exports = {
    name: "guildCreate",

    /**
     * @param {Guild} guild
     * @param {Client} client
     */
    async execute(guild, client) {

        const { name, members, channels } = guild

        let channelToSend

        channels.cache.forEach(channel => {

            if (channel.type === ChannelType.GuildText && !channelToSend && channel.permissionsFor(members.me).has("SendMessages")) channelToSend = channel
        })

        if (!channelToSend) return

        const Embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: name, iconURL: guild.iconURL() })
            .setDescription("Merhaba Ben **Electro**! Beni Sunucuna Eklediğin İçin Teşekürler!")
            .setFooter({ text: "Developed by !     𝘔𝘏𝘔𝘛𝘔𝘦𝘩𝘮𝘦𝘵𝘊𝘢𝘯#7199" })
            .setTimestamp()

        const Row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setURL("https://discord.com/oauth2/authorize?client_id=797873310000087050&permissions=8&scope=bot")
                .setLabel("Davet Et")
        )

        channelToSend.send({ embeds: [Embed], components: [Row]})

    }
}