const criptoMonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado')

const ObjBusqueda = {
    moneda : '',
    criptomoneda: '',
}

//Crear  un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve=>{
    resolve(criptomonedas);
})


document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptoMonedas();

    formulario.addEventListener('submit',submitFormulario)    
    criptoMonedaSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);

})

function consultarCriptoMonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado =>obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas =>selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName,Name} = cripto.CoinInfo
        
        const option = document.createElement('option');
        option.value=Name;
        option.textContent=FullName;

        criptoMonedaSelect.appendChild(option);

    });
}
function leerValor(e){
    ObjBusqueda[e.target.name] = e.target.value;
   
}


function submitFormulario(e){
    e.preventDefault();

    //Validar
    const {moneda,criptomoneda} =ObjBusqueda;

    if(moneda ===''||criptomoneda===''){
        mostrarAlerta('Ambos campos son obligatorios')
        return;
    }
    //Consultar Api con los resultados
    consultarApi();
}
function mostrarAlerta(msg){
    const mensaje = document.querySelector('.error')

    if(!mensaje){    
    
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error')
    
    //Mensaje de error
    divMensaje.textContent = msg;
    formulario.appendChild(divMensaje);
    setTimeout(()=>{
        divMensaje.remove();
    },3000)}


}
function consultarApi(){
    const {moneda,criptomoneda} = ObjBusqueda
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
   
        mostrarSpinner();

    
    fetch(url)
        .then(respuesta=>respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        })

}
function mostrarCotizacionHTML(cotizacion){
  
    LimpiarHTML();

   const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;

   const precio = document.createElement('p')
   precio.classList.add('precio');
   precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

   const precioAlto = document.createElement('p')
   precioAlto.innerHTML = `Precio mas alto del dia : <span>${HIGHDAY}</span>`

   const precioBajo = document.createElement('p')
   precioBajo.innerHTML = `Precio mas bajo del dia : <span>${LOWDAY}</span>`

   const ultimasHoras = document.createElement('p')
   ultimasHoras.innerHTML = `Variacion ultimas 24 horas : <span>${CHANGEPCT24HOUR}%</span>`

   const ultimaActualizacion = document.createElement('p')
   ultimaActualizacion.innerHTML = `Ultima Actualizacion : <span>${LASTUPDATE} </span>`

   resultado.appendChild(precio);
   resultado.appendChild(precioAlto);
   resultado.appendChild(precioBajo);
   resultado.appendChild(ultimasHoras);
   resultado.appendChild(ultimaActualizacion);

}

function LimpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    LimpiarHTML();
    const spinner = document.createElement('div')
    spinner.classList.add('spinner')
    spinner.innerHTML=`
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
 
    `;

    resultado.appendChild(spinner);
}