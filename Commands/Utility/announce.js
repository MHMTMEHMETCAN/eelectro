const { Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "duyuru",
    description: "Bir mesaj duyurur",
    UserPerms: ["ManageGuild"],
    BotPerms: ["ManageGuild"],
    category: "Utility",

    /**
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute (interaction, client) {
        
        const {  } = interaction

        		const modal = new ModalBuilder()
			.setCustomId('announce-modal')
			.setTitle('Duyuru');
		
		const messageInput = new TextInputBuilder()
			.setCustomId('message-input')
			.setLabel("Duyuru")
			.setStyle(TextInputStyle.Paragraph)
            .setPlaceholder("Duyuru mesajını girin")
            .setRequired(true)
	
		const Row = new ActionRowBuilder().addComponents(messageInput);

		modal.addComponents(Row);
		
		await interaction.showModal(modal);
    }
}