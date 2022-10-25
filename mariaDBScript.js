const knexLib = require('knex')

class ClienteProductoSql {
    constructor(config) {
        this.knex = knexLib(config)
    }

    crearTabla() {
    return this.knex.schema.dropTableIfExists('productos')
        .finally(() => {
        return this.knex.schema.createTable('productos', table => {
            table.increments('id').primary();
            table.string('Titulo', 50).notNullable();
            table.string('url', 100).notNullable();
            table.float('Precio').notNullable();;
        })
        })
    }

    insertarProductos(productos) {
        try {
            
            return this.knex('productos').insert(productos)
        } catch (error) {
            console.log(error)
        }
    }

    async listarProductos() {
        return await this.knex('productos').select('*')
    }
    listarProductosById(id) {
        return this.knex('productos').where('id', id).select('*')
    }

    borrarProductoPorId(id) {
        return this.knex.from('productos').where('id', id).del()
    }

    close() {
        this.knex.destroy();
    }
}

module.exports = ClienteProductoSql