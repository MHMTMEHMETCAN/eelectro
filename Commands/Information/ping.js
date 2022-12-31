const { Client, ChatInputCommandInteraction } = require("discord.js")
const Reply = require("../../Systems/Reply")

module.exports = {
  name: "ping",
  description: "Pingi Ölçer",
  category: "Information",

  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {

    return Reply(interaction, "<a:ykkleniyor:972774058976497674>",`Botun Gecikmesi: \`${client.ws.ping}ms\``, false)
  }
}