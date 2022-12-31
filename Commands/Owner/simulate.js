const { Client, ChatInputCommandInteraction } = require("discord.js")
const EditReply = require("../../Systems/EditReply")

module.exports = {
  name: "simulate",
  description: "Simulates the join event",
  UserPerms: ["Administrator"],
  BotPerms: ["Administrator"],
  category: "Owner",
  options: [
    {
        name: "options",
        description: "Choose an option",
        type: 3,
        required: true,
        choices: [
            {
                name: "Join",
                value: "join"
            },
            {
                name: "Leave",
                value: "leave"
            }
        ]
    }
  ],
   /** 
    * @param {ChatInputCommandInteraction} interaction 
    * @param {Client} client 
    */
  async execute(interaction, client) {

    await interaction.deferReply({ ephemeral: true })

    const { options, user, member } = interaction

    const Options = options.getString("options")

    if (user.id !== "730096504647188531") return EditReply(interaction, "<:gvenlik:815620575493095514>", `Bu Komut gizlidir!`)

    switch (Options) {
       
        case "join": {

            EditReply(interaction, "<:evet:815620567947280434>", "Sahte Server Katılım")

            client.emit("guildMemberAdd", member)
        }
            break;

        case "leave": {

            EditReply(interaction, "<:evet:815620567947280434>", "Sahte Server Ayrılma")
   
            client.emit("guildMemberRemove", member)
        }
            break;
    }
}
}