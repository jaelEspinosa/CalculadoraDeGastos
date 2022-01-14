
// Variables  y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
addEventListeners();
function addEventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)

    formulario.addEventListener('submit',agregarGasto )
};

// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos =[];

    }
    nuevoGasto(gasto){
        this.gastos = [... this.gastos, gasto]
        this.calcularRestante()
       // console.log(this.gastos)
    }
    calcularRestante(){
          const gastado = this.gastos.reduce( ( total, gasto )=> total + gasto.cantidad, 0 )
          this.restante = this.presupuesto - gastado;
          console.log('restante', this.restante)
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter ( gasto => gasto.id !== id);
        this.calcularRestante();
    }

}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante}= cantidad;

        // agregar al HTML
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
       
    }
    imprimirAlerta(mensaje, tipo){
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en HTML

        document.querySelector('.primario').insertBefore( divMensaje, formulario)

        // Quitar el HTML

        setTimeout(()=>{
            divMensaje.remove();

        },2000)
    }
    mostrarGastos( gastos ){
        // limpiar  HTML
        this.limpiarHTML()
        
        // iterar sobre el array
        gastos.forEach( gasto =>{
        const { cantidad, nombre, id} = gasto
        // Crear li
        const nuevoGasto = document.createElement('li');  
        nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
        //   nuevoGasto.setAttribute('data-id', id) // esta linea y la de mas abajo hacen lo mismo, 
                                                     // agreagan al elmento un atributo
        nuevoGasto.dataset.id = id;          
        
        // Agregar HTML del gasto
         nuevoGasto.innerHTML = `${nombre} <span class ="badge badge-primary badge-pill">${cantidad} €</span>`

        // Boton para borrar el gasto
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
        btnBorrar.innerHTML = 'X'
        btnBorrar.onclick = ()=>{
            eliminarGasto(id);
        }
        nuevoGasto.appendChild(btnBorrar);

        //Agregar HTML
        gastoListado.appendChild(nuevoGasto)
        })
    }
    limpiarHTML(){
        while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild)
             }
        }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante
        
    }
    comprobarPresupuesto(presupuestoObj){
      
      const { presupuesto, restante } = presupuestoObj
      const divRestante = document.querySelector('.restante');
      //comprobar 25%
      if( (presupuesto/ 4) > restante){
          divRestante.classList.remove('alert-success', 'alert-warning');
          divRestante.classList.add('alert-danger')
          console.log('te queda menos del 25% del saldo')
       }else if( (presupuesto/ 2) > restante){
          divRestante.classList.remove('alert-success');
          divRestante.classList.add('alert-warning')          
      }else{
          divRestante.classList.remove('alert-warning','alert-danger');
          divRestante.classList.add('alert-success') 

      }
      //Si el total es 0 o menor
      if(restante <= 0){
          ui.imprimirAlerta('El presupuesto esta agotado...Elimine algun gasto','error');
          formulario.querySelector('button[type="submit"]').disabled=true
         // alert('presupuesto agotado. Elinine algun gasto')   
        }else{
            formulario.querySelector('button[type="submit"]').disabled=false 
        }
    }


}

const ui = new UI();

let presupuesto;


//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = Number(prompt('Cual es tu presupuesto?'))
       if( isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        alert('Solo valores mayores o iguales a.. "1"')
        window.location.reload();

    }

    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto)


}



// añade gastos

function agregarGasto(e){
    e.preventDefault();

    // leer los datos del fomrulario

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);    

    // validar

    if (nombre === '' || cantidad === ''){
    ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    }else if(cantidad <=0 || isNaN(cantidad)){
    ui.imprimirAlerta('Valor incorrecto','error');    
        return;
    }
    // generar un objeto con el gasto

    const gasto ={nombre, cantidad, id : Date.now()}; // es lo contrario que desestructuring (objet literal)
 
    // añade un nuevo gasto
    presupuesto.nuevoGasto( gasto );

    // mensaje todo ok
    ui.imprimirAlerta( 'Gasto agregado correctamente..')
    
    
    // imprimir gastos
    const { gastos, restante }= presupuesto;
    ui.mostrarGastos( gastos );

    ui.actualizarRestante( restante );
    
    ui.comprobarPresupuesto(presupuesto);
    

    // reinicia el formulario
    formulario.reset();  
}

function eliminarGasto(id){
    
    // elimina los gastos del objeto
    presupuesto.eliminarGasto(id);
    
    // elimina gastos del HTML
    const {gastos, restante}=presupuesto
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    

}
