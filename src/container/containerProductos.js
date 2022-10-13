class ContainterProductos {

    constructor(){
        this.productos = []
    }

    save(producto){
        try {
            producto.id = this.productos.length + 1
            this.productos.push(producto)
            
            return producto
        } catch(error){
            return error
        }
    }

    getAll(){
        return this.productos
    }

    getById(id){
        try {
            let producto
            let pos = id -1 
            if (pos <= this.productos.length && this.productos.length > 0 && this.productos[pos] != null){
                producto = this.productos[pos]
            }else{
                producto = { error : 'Producto no encontrado' }
            }
            return producto
        } catch(error){
            return error
        }
    }

    modifById(id, producto){
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

    deleteById(id){
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