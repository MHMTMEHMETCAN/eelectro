const { Client, ChannelType } = require("discord.js");
const DarkDashboard = require("dbd-dark-dashboard");
const DBD = require("discord-dashboard");
const GeneralLogsDB = require("../../Structures/Schemas/LogsChannel")
const LogsSwitch = require("../../Structures/Schemas/GeneralLogs")
const WelcomeDB = require("../../Structures/Schemas/Welcome")

module.exports = {
  name: "ready",

  /**
   * @param {Client} client
   */
  async execute(client) {

    const { user } = client


    let Information = []
    let Moderation = []
    let Utility = []

    const info = client.commands.filter(x => x.category === "Information")
    const mod = client.commands.filter(x => x.category === "Moderation")
    const ex = client.commands.filter(x => x.category === "Utility")

    CommandPush(info, Information)
    CommandPush(mod, Moderation)
    CommandPush(ex, Utility)

    await DBD.useLicense(process.env.DBD);
    DBD.Dashboard = DBD.UpdatedClass();

    const Dashboard = new DBD.Dashboard({
      port: 8000,
      client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
      },
      redirectUri: "http://electrotr.ml/discord/callback",
      domain: "http://electrotr.ml",
      bot: client,
      supportServer: {
        slash: "/support",
        inviteUrl: "https://discord.gg/XubbQtHSyJ",
      },
      acceptPrivacyPolicy: true,
      minimizedConsoleLogs: true,
      guildAfterAuthorization: {
        use: true,
        guildId: "814753864632500294",
      },
      invite: {
        clientId: client.user.id,
        scopes: ["bot", "applications.commands", "guilds", "identify"],
        permissions: "8",
        redirectUri: "https://discord.gg/XubbQtHSyJ",
      },
      theme: DarkDashboard({
        information: {
          createdBy: "Electro",
          websiteTitle: "Electro",
          websiteName: "Electro",
          websiteUrl: "https:/www.Electro.ml/",
          dashboardUrl: "http://localhost:8000/",
          supporteMail: "support@Electro.ml",
          supportServer: "https://discord.gg/XubbQtHSyJ",
          imageFavicon: "https://i.hizliresim.com/9r0jwbl.png",
          iconURL: "https://i.hizliresim.com/9r0jwbl.png",
          loggedIn: "Başarıyla oturum açıldı.",
          mainColor: "#2CA8FF",
          subColor: "#ebdbdb",
          preloader: "Yükleniyor...",
        },

        index: {
          card: {
            category: "Electro Panel - Her şeyin merkezi",
            title: `Botun temel özelliklerini kontrol edebileceğiniz Electro Dashboard'a hoş geldiniz.`,
            image: "https://i.imgur.com/axnP93g.png",
            footer: "Developed by !     𝘔𝘏𝘔𝘛𝘔𝘦𝘩𝘮𝘦𝘵𝘊𝘢𝘯#7199",
          },

          information: {
            category: "Category",
            title: "Bilgi",
            description: `Bu bot ve panel şu anda devam eden bir çalışmadır, bu nedenle discord ile ilgili herhangi bir sorun bulursanız benimle iletişime geçin.`,
            footer: "Developed by !     𝘔𝘏𝘔𝘛𝘔𝘦𝘩𝘮𝘦𝘵𝘊𝘢𝘯#7199",
          },

          feeds: {
            category: "Category",
            title: "Bilgi",
            description: `Bu bot ve panel şu anda devam eden bir çalışmadır, bu nedenle discord ile ilgili herhangi bir sorun bulursanız benimle iletişime geçin.`,
            footer: "Developed by !     𝘔𝘏𝘔𝘛𝘔𝘦𝘩𝘮𝘦𝘵𝘊𝘢𝘯#7199",
          },
        },

        commands: [
          {
            category: `Bot`,
            subTitle: `Bot Komutları`,
            aliasesDisabled: false,
            list: Information
          },
          {
            category: `Moderasyon`,
            subTitle: `Moderasyon Komutları`,
            aliasesDisabled: false,
            list: Moderation
          },
          {
            category: `Genel`,
            subTitle: `Genel Komutlar`,
            aliasesDisabled: false,
            list: Utility
          }
        ],
      }),
      settings: [

        // Welcome System

        {
          categoryId: "welcome",
          categoryName: "Welcome System",
          categoryDescription: "Setup the welcome Channel",
          categoryOptionsList: [
            {
              optionId: "welch",
              optionName: "Hoşgeldin Kanalı",
              optionDescription: "Sunucunun karşılama kanalını ayarlayın veya sıfırlayın",
              optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
              getActualSet: async ({ guild }) => {
                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.Channel
                else return null
              },
              setNew: async ({ guild, newData })=> {

                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = null

                if (!data) {

                  data = new WelcomeDB({
                    Guild: guild.id,
                    Channel: newData,
                    DM: false,
                    DMMessage: null,
                    Content: false,
                    Embed: false
                  })

                  await data.save()

                } else {

                  data.Channel = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "weldm",
              optionName: "Hoşgeldin DM",
              optionDescription: "Karşılama Mesajını Etkinleştirin veya Devre Dışı Bırakın (DM)",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.DM
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new WelcomeDB({
                    Guild: guild.id,
                    Channel: null,
                    DM: newData,
                    DMMessage: null,
                    Content: false,
                    Embed: false
                  })

                  await data.save()

                } else {

                  data.DM = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "weldmopt",
              optionName: "Hoşgeldin DM Opsiyon",
              optionDescription: "Mesaj Gönder",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  first: true
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.Content
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new WelcomeDB({
                    Guild: guild.id,
                    Channel: null,
                    DM: false,
                    DMMessage: null,
                    Content: newData,
                    Embed: false
                  })

                  await data.save()

                } else {

                  data.Content = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "welcembed",
              optionName: "",
              optionDescription: "Embed Gönder",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  last: true
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.Embed
                else return false
              },
              setNew: async ({ guild, newData }) => {

                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new WelcomeDB({
                    Guild: guild.id,
                    Channel: null,
                    DM: false,
                    DMMessage: null,
                    Content: false,
                    Embed: newData
                  })

                  await data.save()

                } else {

                  data.Embed = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "weldmmsg",
              optionName: "Hoş Geldiniz Mesajı (DM)",
              optionDescription: "Yeni katılan üyenin DM'sine mesaj gönder",
              optionType: DBD.formTypes.embedBuilder({
                username: user.username,
                avatarURL: user.avatarURL(),
                defaultJson: {
                  content: "Hoşgeldin",
                  embed: {
                    description: "Hoşgeldin"
                  }
                }
              }),
              getActualSet: async ({ guild }) => {
                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.DMMessage
                else return null
              },
              setNew: async ({ guild, newData })=> {

                let data = await WelcomeDB.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new WelcomeDB({
                    Guild: guild.id,
                    Channel: null,
                    DM: false,
                    DMMessage: newData,
                    Content: false,
                    Embed: false
                  })

                  await data.save()

                } else {

                  data.DMMessage = newData
                  await data.save()
                }
               
                return
                
              }
            },
          ]
        },

        // Logging System
        {
          categoryId: "logs",
          categoryName: "Logging System",
          categoryDescription: "Genel Log kanalları & Davet Log",
          categoryOptionsList: [
            {
              optionId: "gench",
              optionName: "Genel Log Kanalı",
              optionDescription: "Sunucunun Log kanalını ayarlayın veya sıfırlayın",
              optionType: DBD.formTypes.channelsSelect(false, channelTypes = [ChannelType.GuildText]),
              getActualSet: async ({ guild }) => {
                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.Channel
                else return null
              },
              setNew: async ({ guild, newData })=> {

                let data = await GeneralLogsDB.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = null

                if (!data) {

                  data = new GeneralLogsDB({
                    Guild: guild.id,
                    Channel: newData,
                    DM: false,
                    DMMessage: null,
                    Content: false,
                    Embed: false
                  })

                  await data.save()

                } else {

                  data.Channel = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "memrole",
              optionName: "Log Sistemini Özelleştir",
              optionDescription: "Üye Rolü",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  first: true
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.MemberRole
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    MemberRole: newData
                  })

                  await data.save()

                } else {

                  data.MemberRole = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "memnick",
              optionName: "",
              optionDescription: "Üye Takma Adı",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  minimalbutton: true
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.MemberNick
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    MemberNick: newData
                  })

                  await data.save()

                } else {

                  data.MemberNick = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "chntpc",
              optionName: "",
              optionDescription: "Kanal Konusu",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  minimalbutton: true
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.ChannelTopic
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    ChannelTopic: newData
                  })

                  await data.save()

                } else {

                  data.ChannelTopic = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "membst",
              optionName: "",
              optionDescription: "Üye Takviyesi",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  last: true,
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.MemberBoost
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    MemberBoost: newData
                  })

                  await data.save()

                } else {

                  data.MemberBoost = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "rolest",
              optionName: "",
              optionDescription: "Rol Durumu",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  first: true,
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.RoleStatus
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    RoleStatus: newData
                  })

                  await data.save()

                } else {

                  data.RoleStatus = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "chnst",
              optionName: "",
              optionDescription: "Kanal Durumu",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  minimalbutton: true,
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.ChannelStatus
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    ChannelStatus: newData
                  })

                  await data.save()

                } else {

                  data.ChannelStatus = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "emjst",
              optionName: "",
              optionDescription: "Emoji Durumu",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  minimalbutton: true,
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.EmojiStatus
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    EmojiStatus: newData
                  })

                  await data.save()

                } else {

                  data.EmojiStatus = newData
                  await data.save()
                }
               
                return
                
              }
            },
            {
              optionId: "memban",
              optionName: "",
              optionDescription: "Member Ban",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  last: true,
                }
              },
              getActualSet: async ({ guild }) => {
                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })
                if (data) return data.MemberBan
                else return false
              },
              setNew: async ({ guild, newData })=> {

                let data = await LogsSwitch.findOne({ Guild: guild.id }).catch(err => { })

                if (!newData) newData = false

                if (!data) {

                  data = new LogsSwitch({
                    Guild: guild.id,
                    MemberBan: newData
                  })

                  await data.save()

                } else {

                  data.MemberBan = newData
                  await data.save()
                }
               
                return
                
              }
            },
          ]
        },

      ]
    });

    Dashboard.init()


  },
};

function CommandPush(filteredArray, CategoryArray) {

    filteredArray.forEach(obj => {

        let cmdObject = {
            commandName: obj.name,
            commandUsage: "/" + obj.name,
            commandDescription: obj.description,
            commandAlias: "None"
        }

        CategoryArray.push(cmdObject)



    })
}
