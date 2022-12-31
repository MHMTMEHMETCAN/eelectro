const { Client, ChatInputCommandInteraction, ButtonStyle, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")

module.exports = {
  name: "unban",
  description: "Affettiğin Kişilerin Banını Kaldır",
  UserPerms: ["BanMembers"],
  BotPerms: ["BanMember"],
  category: "Moderation",
  options: [
    {
      name: "kullanıcı-id",
      description: "Bir İd Gir",
      type: 3,
      required: true
    },
  ],

  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {

    await interaction.deferReply({ ephemeral: true })

    const { options, user, guild } = interaction

    const id = options.getString("kullanıcı-id")
    if (isNaN(id)) return EditReply(interaction, "<:hayr:815620569520406548>", `Lütfen İd olarak Geçerli bir Kimlik girin`)

    const bannedMembers = await guild.bans.fetch()
    if(!bannedMembers.find(x => x.user.id === id)) return EditReply(interaction, "<:hayr:815620569520406548>", `Kullanıcı henüz yasaklanmadı`)
    
  
    const Embed = new EmbedBuilder()
      .setColor(client.color)
    
    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("unban-evet")
        .setLabel("Evet"),

      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("unban-hayır")
        .setLabel("Hayır")
    )

    const Page = await interaction.editReply({

      embeds: [
        Embed.setDescription('<a:mhmtraptiye:972773993100763166> **| Eskiden Banlanan Bir Kullanıcının Artık Sunucuna Giriş İzni Vermek İstediğine Eminmisin?**')
      ],
      components: [row]
    })



    const col = await Page.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: ms("15s")
    })

    col.on("collect", i => {

      if (i.user.id !== user.id) return

      switch(i.customId){

        case "unban-evet": {

          guild.members.unban(id)

          interaction.editReply({
            embeds: [
              Embed.setDescription(`<:evet:815620567947280434> | ${member} Adlı Kullanıcının Banı  Kaldırıldı Artık Sınırlarımıza Girebilir`)
            ],
            components: []
          })

        }
          break;

        case "unban-hayır": {

          interaction.editReply({
            embeds: [
              Embed.setDescription(`<a:tik:815620583164477481> | Komut İptal Edildi `)
            ],
            components: []
          })

        }
         break;
      }
    })



    col.on("end", (collected) => {
      if (collected.size > 0) return

      interaction.editReply({
        embeds: [
          Embed.setDescription(`<:hayr:815620569520406548> | zaman içinde geçerli bir cevap verilmedi `)
        ],
        components: []
      })
    })
   
  }
}