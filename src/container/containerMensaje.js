const fs = require('fs');

class ContainterMensaje {

    constructor(file){
        this.file = file
    }

    async save(mensaje){
        try {
            let mensajes = await this.getAll()
            await mensajes.push(mensaje)
            await fs.promises.writeFile(this.file, JSON.stringify(mensajes, null, 2))
        } catch(error){
            return error
        }
    }

    async getAll(){
        let mensajes = await fs.promises.readFile(this.file)
        let obj = await JSON.parse(mensajes)
        return obj
    }
}

module.exports = ContainterMensaje