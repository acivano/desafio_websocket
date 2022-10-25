const ClienteMensajeSql = require('../../sqLiteScripts.js')

const { options } = require('../../options/SQLite3.js')


class ContainterMensaje {

    constructor(){
        this.sql = new ClienteMensajeSql(options)
        this.sql.crearTabla()
    }

    async save(mensaje){
        try {
            return await this.sql.insertarMensajes(mensaje)
        } catch(error){
            return error
        }
    }

    async getAll(){
        let mensajes = await this.sql.listarMensajes()
        return mensajes
    }
}

module.exports = ContainterMensaje