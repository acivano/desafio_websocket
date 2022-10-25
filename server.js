// const ClienteProductoSql = require('./mariaDBScript.js')
// const { options } = require('./options/mariaDB.js')

const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { engine } = require('express-handlebars')
const ContainterProductos = require('./src/container/containerProductos')
const ContainterMensaje = require('./src/container/containerMensaje')


const ProductContainer = new ContainterProductos()

const MensajesContainer = new ContainterMensaje()
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.get('/', async (req,res) => {
    res.render('formulario',  await ProductContainer.getAll())
})
app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))
app.set('view engine', 'handlebars')
app.set('views', './views')


io.on('connection', async socket => {
    console.log('Nuevo usuario')
    socket.emit('messages', await MensajesContainer.getAll()) 
    socket.emit('products', await ProductContainer.getAll())

    socket.on('new-message', async data => {
        await MensajesContainer.save(data) 
        io.sockets.emit('messages', await MensajesContainer.getAll()) 
    })

    socket.on('new-product', async data => {
        await ProductContainer.save(data)
        io.sockets.emit('products', await ProductContainer.getAll())
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


