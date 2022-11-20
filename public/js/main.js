let socket = io.connect()

socket.on('messages', data =>{
    render(data)
})

socket.on('products', data =>{

    renderProductos(data)
})

function render(data){

    let html = data.map( elem =>{
        return(
            `<div>
                <strong class="font-weight-bold text-primary">${elem.email}</strong>
                <em  class="text-danger">[${elem.datetime}]:</em>
                <em class="font-italic text-success">${elem.text}</em>
            </div>`
        )
    }).join(" ")
    document.getElementById('messages').innerHTML = html

}

async function renderProductos(/*data*/){

    const prod = await fetch('http://localhost:8080/api/productos-test');

    const data = await prod.json();

    console.log(data)
    if (data.length == 0) {
        let html = `<h3 class="alert alert-danger">No se encontraron datos</h3>`
        document.getElementById('tabla').innerHTML = html

    } else {
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


}

function addMessage(){
    let mensaje = {
        email : document.getElementById('email').value,
        datetime : new Date().toLocaleString(),
        text : document.getElementById('text').value,
    }
    console.log(mensaje)
    socket.emit('new-message', mensaje)
    document.getElementById('text').value = ''
    document.getElementById('text').focus()

    return false
}

function addProduct(){
    // let productoNuevo = {
    //     Titulo : document.getElementById('Titulo').value,
    //     Precio : document.getElementById('Precio').value,
    //     url : document.getElementById('url').value
    // }

    //socket.emit('new-product', productoNuevo)
    // document.getElementById('Titulo').value =''
    // document.getElementById('Precio').value = null
    // document.getElementById('url').value = ''

    return false
}