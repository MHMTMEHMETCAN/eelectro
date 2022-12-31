const { Client, ChatInputCommandInteraction, ButtonStyle, ComponentType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const ms = require("ms")
const EditReply = require("../../Systems/EditReply")

module.exports = {
  name: "ban",
  description: "İstenmeyen kişileri Sunucundan Banla",
  UserPerms: ["BanMembers"],
  BotPerms: ["BanMember"],
  category: "Moderation",
  options: [
    {
      name: "kullanıcı",
      description: "Bir Kullanıcı Seç",
      type: 6,
      required: true
    },
    {
      name: "sebep",
      description: "Neden Banlamak İstiyorsun",
      type: 3,
      required: false
    }
  ],

  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {

    await interaction.deferReply({ ephemeral: true })

    const { options, user, guild } = interaction

    const member = options.getMember("kullanıcı")
    const reason = options.getString("sebep") || "Sebep Belirtilmemiş"

    if (member.id === user.id) return EditReply(interaction, "<:hayr:815620569520406548>", `Kendini Banlayamazsın!`)
    if (guild.ownerId === member.id) return EditReply(interaction, "<:hayr:815620569520406548>", `Sunucu Sahibini Banlayamazsın`)
    if (guild.members.me.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "<:hayr:815620569520406548>", `kendinle aynı yetkide veya üst yetkilerdeki kişileri Banlayamazsın!`)
    if (interaction.member.roles.highest.position <= member.roles.highest.position) return EditReply(interaction, "<:hayr:815620569520406548>", `kendimle aynı yetkide veya üst yetkilerdeki kişileri Banlayamam!`)

    const Embed = new EmbedBuilder()
      .setColor(client.color)
    
    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("ban-evet")
        .setLabel("Evet"),

      new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setCustomId("ban-hayır")
        .setLabel("Hayır")
    )

    const Page = await interaction.editReply({

      embeds: [
        Embed.setDescription('<a:mhmtraptiye:972773993100763166> **| Bu kullanıcı sunucudan kalıcı olarak yasaklanacak! Onaylıyor musun**')
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

        case "ban-evet": {

          member.ban({reason})

          interaction.editReply({
            embeds: [
              Embed.setDescription(`<:evet:815620567947280434> | ${member} Adlı Kullanıcı** ${reason} **Sebebinden Sunucudan Banlanmıştır`)
            ],
            components: []
          })

          member.send({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(`<a:banned:972770638227976252> | **${guild.name}** Adlı Yetkili Malesef Seni Sunucudan Banladı `)
            ]
          }).catch(err => {

            if (err.code !== 50007) return console.log(err)

          })

        }
          break;

        case "ban-hayır": {

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