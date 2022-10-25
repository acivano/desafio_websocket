const knexLib = require('knex')

class ClienteMensajesSql {
    constructor(config) {
        this.knex = knexLib(config)
    }
    
    crearTabla() {
    return this.knex.schema.dropTableIfExists('mensajes')
        .finally(() => {
        return this.knex.schema.createTable('mensajes', table => {
            table.increments('id').primary();
            table.string('email', 50).notNullable();
            table.string('text', 100).notNullable();
            table.dateTime('datetime').notNullable();;
        })
        })
    }

    async insertarMensajes(mensajes) {
        return await this.knex('mensajes').insert(mensajes)
    }

    async listarMensajes() {
        return await this.knex('mensajes').select('*')
    }

    close() {
        this.knex.destroy();
    }
}

module.exports = ClienteMensajesSql