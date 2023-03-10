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
          loggedIn: "Ba??ar??yla oturum a????ld??.",
          mainColor: "#2CA8FF",
          subColor: "#ebdbdb",
          preloader: "Y??kleniyor...",
        },

        index: {
          card: {
            category: "Electro Panel - Her ??eyin merkezi",
            title: `Botun temel ??zelliklerini kontrol edebilece??iniz Electro Dashboard'a ho?? geldiniz.`,
            image: "https://i.imgur.com/axnP93g.png",
            footer: "Developed by !     ????????????????????????????????????????????????????#7199",
          },

          information: {
            category: "Category",
            title: "Bilgi",
            description: `Bu bot ve panel ??u anda devam eden bir ??al????mad??r, bu nedenle discord ile ilgili herhangi bir sorun bulursan??z benimle ileti??ime ge??in.`,
            footer: "Developed by !     ????????????????????????????????????????????????????#7199",
          },

          feeds: {
            category: "Category",
            title: "Bilgi",
            description: `Bu bot ve panel ??u anda devam eden bir ??al????mad??r, bu nedenle discord ile ilgili herhangi bir sorun bulursan??z benimle ileti??ime ge??in.`,
            footer: "Developed by !     ????????????????????????????????????????????????????#7199",
          },
        },

        commands: [
          {
            category: `Bot`,
            subTitle: `Bot Komutlar??`,
            aliasesDisabled: false,
            list: Information
          },
          {
            category: `Moderasyon`,
            subTitle: `Moderasyon Komutlar??`,
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
              optionName: "Ho??geldin Kanal??",
              optionDescription: "Sunucunun kar????lama kanal??n?? ayarlay??n veya s??f??rlay??n",
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
              optionName: "Ho??geldin DM",
              optionDescription: "Kar????lama Mesaj??n?? Etkinle??tirin veya Devre D?????? B??rak??n (DM)",
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
              optionName: "Ho??geldin DM Opsiyon",
              optionDescription: "Mesaj G??nder",
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
              optionDescription: "Embed G??nder",
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
              optionName: "Ho?? Geldiniz Mesaj?? (DM)",
              optionDescription: "Yeni kat??lan ??yenin DM'sine mesaj g??nder",
              optionType: DBD.formTypes.embedBuilder({
                username: user.username,
                avatarURL: user.avatarURL(),
                defaultJson: {
                  content: "Ho??geldin",
                  embed: {
                    description: "Ho??geldin"
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
          categoryDescription: "Genel Log kanallar?? & Davet Log",
          categoryOptionsList: [
            {
              optionId: "gench",
              optionName: "Genel Log Kanal??",
              optionDescription: "Sunucunun Log kanal??n?? ayarlay??n veya s??f??rlay??n",
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
              optionName: "Log Sistemini ??zelle??tir",
              optionDescription: "??ye Rol??",
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
              optionDescription: "??ye Takma Ad??",
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
              optionDescription: "??ye Takviyesi",
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
