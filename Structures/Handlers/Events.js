const { Events } = require("../Validation/EventNames")

module.exports = async(client, PG, Ascii) => {

    const Table  = new Ascii("Eventler Yüklendi")

    const EventFiles = await PG(`${process.cwd()}/Events/*/*.js`)

    EventFiles.map(async file => {

        const event = require(file)

        if (!Events.includes(event.name) || !event.name) {

            const L = file.split("/")

            await Table.addRow(`${event.name || "Hatalı"}`, `Etkinlik Adı Geçersiz Veya Eksik: ${L[6] + `/` + L[7]}`)
            return

        }

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
        else client.on(event.name, (...args) => event.execute(...args, client))

        await Table.addRow(event.name, "Başarılı")
    })

    console.log(Table.toString())
}