const { Perms } = require("../Validation/Permissions")
const { Client } = require("discord.js")
const ms = require("ms")

/**
 * @param { Client } client
 */
module.exports = async (client, PG, Ascii) => {

    const Table = new Ascii("Komut Yüklendi")

    let CommandsArray = []

    const CommandsFiles = await PG(`${process.cwd()}/Commands/*/*.js`)

    CommandsFiles.map(async (file) => {

        const command = require(file)

        if (!command.name) return Table.addRow(file.split("/")[7], "Hatalı", "İsim Eksik")
        if (!command.context && !command.description) return Table.addRow(command.name, "Hatalı", "Açıklama Eksik")
        if (command.Userperms)
            if (command.Userperms.every(perms => Perms.includes(perms))) command.default_member_permissions = false
            else return Table.addRow(command.name, "Hatalı", "Kullanıcı İzinleri Geçersiz")

        client.commands.set(command.name, command)
        CommandsArray.push(command)

        await Table.addRow(command.name, "Başarılı")
    })


    console.log(Table.toString())

    client.on("ready", () => {

        setInterval(() => {
           
            client.guilds.cache.forEach(guild => {

                guild.commands.set(CommandsArray)
            })


        }, ms("5s"));
    })
}