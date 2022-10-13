const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { engine } = require('express-handlebars')
const ContainterProductos = require('./src/container/containerProductos')
const ContainterMensaje = require('./src/container/containerMensaje')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get('/', (req,res) => {
    const productos = ProductContainer.getAll()
    res.render('formulario', {productos })
})

app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))
app.set('view engine', 'handlebars')
app.set('views', './views')

const ProductContainer = new ContainterProductos()
const MensajesContainer = new ContainterMensaje('mensajes.txt')

let mensajes =  []


io.on('connection', socket => {
    console.log('Nuevo usuario')
    socket.emit('messages', mensajes) //la variable mensajes debería llamar al metodo MensajesContainer.getAll() para obtener todos los mensajes del archivo. Pero al ser asincrono, lo manda vacío.
    let productos = ProductContainer.getAll()
    socket.emit('products', productos)

    socket.on('new-message', data => {
        MensajesContainer.save(data) //lo guarda bien el mensaje en el archivo
        mensajes.push(data)
        io.sockets.emit('messages', data) // al ser getAll un async, el parametro "mensajes" pasa vacío
    })

    socket.on('new-product', data => {
        ProductContainer.save(data)
        io.sockets.emit('products', ProductContainer.getAll())
    }    
    
)
})

/* ------------------------------------------------------ */
/* Server Listen */
const PORT = process.env.PORT || 8081

const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
srv.on('error', error => console.log(`Error en servidor ${error}`))


