const ClienteProductoSql = require('../../mariaDBScript.js')

const { options } = require('../../options/mariaDB.js')

class ContainterProductos {

    constructor(){
        this.sql = new ClienteProductoSql(options)
        this.sql.crearTabla()
    }

    async save(producto){
        try {
            return await this.sql.insertarProductos(producto)
        } catch(error){
            return error
        }
    }

    async getAll(){
        let productos = await this.sql.listarProductos()
        
        return (productos)
    }

    async getById(id){
        try {
            let producto = await this.sql.insertarProductoById(id)
            if (producto){
                return producto
            }else{
                producto = { error : 'Producto no encontrado' }
            }
            return producto
        } catch(error){
            return error
        }
    }

    async modifById(id, producto){
        try {
            let pos = id -1 
            if (pos <= this.productos.length && this.productos.length > 0){
                this.productos[pos] = {...producto, ...{id: pos +1}}
            }
            return this.productos[pos] || { error : 'producto no encontrado' }
        } catch(error){
            return error
        } 
    }

    async deleteById(id){
        try {
            let pos = id -1 
            if (pos <= this.productos.length && this.productos.length > 0){
                this.productos[pos] = null
            }
            return {Mensaje : `Producto ${id} eliminado con éxito`}
        } catch(error){
            return error
        } 
    }
}

module.exports = ContainterProductos