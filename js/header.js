document.querySelector('#btnMenu').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#navbar').classList.toggle('active')
})