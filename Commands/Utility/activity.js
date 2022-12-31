const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")
const EditReply = require("../../Systems/EditReply")

module.exports = {
    name: "etkinlik",
    description: "Birlikte Discord Etkinliği Oluşturur",
    category: "Utility",
    options: [
        {
            name: "type",
            description: "Bir Discord Etkinliği Seçin",
            type: 3,
            required: true,
            choices: [
                {
                    name:"Youtube",
                    value: "1"
                },
                {
                    name:"Satranç",
                    value: "2"
                },
                {
                    name:"Betrayal",
                    value: "3"
                },
                {
                    name:"Poker",
                    value: "4"
                },
                {
                    name:"Fish",
                    value: "5"
                },
                {
                    name:"Letter Tile",
                    value: "6"
                },
                {
                    name:"Word Snack",
                    value: "7"
                },
                {
                    name:"Doodle Crew",
                    value: "8"
                },
                {
                    name:"Spell Cast",
                    value: "9"
                },
                {
                    name:"AwkWord",
                    value: "10"
                },
                {
                    name:"Putt Party",
                    value: "11"
                },
            ]
        }
    ],

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute (interaction, client) {

        const { options, member } = interaction
        const choices = options.getString("type")

        const App = client.discordTogether

        const VC = member.voice.channel
        if (!VC) return Reply(interaction, "<:hayr:815620569520406548>",`Bu komutu kullanmak için bir Ses Kanalında olmalısınız`, true)

        await interaction.deferReply()

        switch (choices) {
            case "1": {

                App.createTogetherCode(VC.id, "youtube").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Youtube Etkinliği](${invite.code})**`))

            }
                break;
            case "2": {

                App.createTogetherCode(VC.id, "chess").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Satranç Etkinliği](${invite.code})**`))
    
            }
                break;     
            case "3": {

                App.createTogetherCode(VC.id, "betrayal").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Betrayal Etkinliği](${invite.code})**`))
    
            }
                break;    
            case "4": {

                App.createTogetherCode(VC.id, "poker").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Poker Etkinliği](${invite.code})**`))
    
            }
                break;
            case "5": {

                App.createTogetherCode(VC.id, "fish").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Fish Etkinliği](${invite.code})**`))
    
            }
                break; 
            case "6": {

                App.createTogetherCode(VC.id, "lettertile").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Letter Tile Etkinliği](${invite.code})**`))
    
            }
                break; 
            case "7": {

                App.createTogetherCode(VC.id, "wordsnack").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Word Snack Etkinliği](${invite.code})**`))
    
            }
                break; 
            case "8": {

                App.createTogetherCode(VC.id, "doodlecrew").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Doodle Crew Etkinliği](${invite.code})**`))
    
            }
                break; 
            case "9": {

                App.createTogetherCode(VC.id, "spellcast").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Spell Cast Etkinliği](${invite.code})**`))
    
            }
                break;  
            case "10": {

                App.createTogetherCode(VC.id, "awkword").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[AwkWord Etkinliği](${invite.code})**`))
    
            }
                break;
            case "11": {

                App.createTogetherCode(VC.id, "puttparty").then(invite => EditReply(interaction, "<a:saok:815620579071623180>", `Katılmak için buraya tıklayın **[Putt Party Etkinliği](${invite.code})**`))
    
            }
                break;                   
                     
        }
    }
}