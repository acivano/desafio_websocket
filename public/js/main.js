let socket = io.connect()

socket.on('messages', data =>{
    render(data)
})

socket.on('products', data =>{
    console.log('socketproducts')
    console.log(data)
    renderProductos(data)
})

function render(data){
    console.log('logs del render de mensaje')
    console.log(data)
    let html = data.map( elem =>{
        return(
            `<div>
                <strong>${elem.email}</strong>
                <em>${elem.datetime}</em>
                <em>${elem.text}</em>
            </div>`
        )
    }).join(" ")
    document.getElementById('messages').innerHTML = html

}

function renderProductos(data){
    let html = 
    `<table class="table">
        <thead>
            <tr>
                <th scope="col" class="text-center align-middle">Titulo</th>
                <th scope="col" class="text-center align-middle">Precio</th>
                <th scope="col" class="text-center align-middle">url</th>
            </tr>
        </thead>
        <tbody id="productos">
        </tbody>
    </table>`
    
    
    let productos = data.map( elem =>{
        return(
            `<tr>
                <td class="text-center align-middle">${elem.Titulo }</td>
                <td class="text-center align-middle">${elem.Precio}</td>
                <td class="text-center align-middle"> <img src="${elem.url}" class="mh-25" alt="Producto ${elem.Titulo}"></td>
            </tr>
        `
        )
    }).join(" ")
    document.getElementById('tabla').innerHTML = html
    document.getElementById('productos').innerHTML = productos

}

function addMessage(){
    console.log('Entro al addMessage')
    let mensaje = {
        email : document.getElementById('email').value,
        datetime : new Date().toLocaleString(),
        text : document.getElementById('text').value,
    }

    socket.emit('new-message', mensaje)
    document.getElementById('text').value = ''
    document.getElementById('text').focus()

    return false
}

function addProduct(){
    let productoNuevo = {
        Titulo : document.getElementById('Titulo').value,
        Precio : document.getElementById('Precio').value,
        url : document.getElementById('url').value
    }
    let producto = {
        Titulo : "pepe",
        Precio : 1,
        url : 'https://cdn3.iconfinder.com/data/icons/eco-flat-2/512/Can_garden_water_watering-64.png'
    }
    console.log(`addProduct = ${JSON.stringify(productoNuevo)}`)
    fetch('/api/productos', {
        method: 'POST',
        body: JSON.stringify(productoNuevo),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then (res=>res.json())
    .then(() => {
        console.log(producto)
        socket.emit('new-product', producto)
        document.getElementById('Titulo').value =''
        document.getElementById('Precio').value = null
        document.getElementById('url').value = ''


    })
    // socket.emit('new-product', producto)
    // document.getElementById('Titulo').value =''
    // document.getElementById('Precio').value = null
    // document.getElementById('url').value = ''

    return false
}