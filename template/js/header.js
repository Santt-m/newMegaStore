const navBtn = document.getElementById('navBtn');
const navMenu = document.querySelector('nav');

const cartBtn = document.getElementById('cartBtn');
const cartMenu = document.getElementById('cartMenu')

export function init () {
    console.log('header init')

    // boton nav
    navBtn.addEventListener('click', () =>{
        // si el nav esta active
        if(navMenu.classList.contains('fx-active')){
            // activa efecto de cierre
            navMenu.classList.add('fx-close');
            // deja pasar el efecto y borra las class
            setTimeout(()=> {
                navMenu.classList.remove('fx-active','fx-close')
            },500);
        }
        // si el nav no esta active
        else{
            // forzar cierre cart
            cartMenu.classList.add('dnone')
            // activa el nav
            navMenu.classList.add('fx-active');
        };

    });
};

// Init al cargar el dom
document.addEventListener('DOMContentLoaded', init);
