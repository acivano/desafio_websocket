const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { engine } = require('express-handlebars')
const ContainterProductos = require('./src/container/containerProductos')
const ContainterMensaje = require('./src/container/containerMensaje')

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials'
}))
app.set('view engine', 'handlebars')
app.set('views', './views')


let products = [
    { id:'1', Titulo: 'prod1', Precio: '123', url: 'https://cdn3.iconfinder.com/data/icons/eco-flat-2/512/Can_garden_water_watering-64.png' },
    { id:'2', Titulo: 'prod2', Precio: '345', url: 'https://cdn3.iconfinder.com/data/icons/eco-flat-2/512/Can_garden_water_watering-64.png' }
]


const ProductContainer = new ContainterProductos()
const MensajesContainer = new ContainterMensaje('mensajes.txt')


app.get('/', (req,res) => {
    const productos = ProductContainer.getAll()
    console.log('renderiza')
    res.render('formulario', {productos })
})
app.get('/api/productos', (req,res) => {
    const productos = ProductContainer.getAll()
    res.json(productos)
})

app.get('/api/productos/:id', (req,res) => {
    res.json(ProductContainer.getById(parseInt(req.params.id)))
}) 

app.post('/api/productos', (req, res) => {
    console.log(req.body)
    let rsp = ProductContainer.save(req.body)

    res.json(rsp)
})

app.put('/api/productos/:id', (req,res) => {

    res.json(ProductContainer.modifById(req.params.id, req.body) )
})

app.delete('/api/productos/:id', (req,res) => {
    res.json(ProductContainer.deleteById(req.params.id))
})

let mensajes =  [
    {
      "email": "nuevo",
      "datetime": "11/10/2022, 21:23:33",
      "text": "nuevo"
    },
    {
      "email": "nuevoasd",
      "datetime": "11/10/2022, 21:29:49",
      "text": "as"
    }
  ]


io.on('connection', socket => {
    console.log('Nuevo usuario')
    socket.emit('messages', mensajes) //la variable mensajes debería llamar al metodo MensajesContainer.getAll() para obtener todos los mensajes del archivo. Pero al ser asincrono, lo manda vacío.
    socket.emit('products', products)

    socket.on('new-message', data => {
        MensajesContainer.save(data) //lo guarda bien el mensaje en el archivo
        let mensajes = MensajesContainer.getAll() //getAll es un async que va a buscar los mensajes al archivo 'mensajes.txt'.
        io.sockets.emit('messages', mensajes) // al ser getAll un async, el parametro "mensajes" pasa vacío
    })

    socket.on('new-product', data => {
        // fetch('/api/productos')
        // .then(res => res.json)
        // .then(data => 
        //     {
        //         console.log(data)
        //         io.sockets.emit('products', data)
        //     })
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


