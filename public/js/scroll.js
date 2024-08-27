document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const scrollLeftButton = document.getElementById('scrollLeft');
    const scrollRightButton = document.getElementById('scrollRight');
    const songlist = document.querySelector('.songlist');

    if (scrollLeftButton && scrollRightButton && songlist) {
        // Añadir eventos de click a los botones
        scrollLeftButton.addEventListener('click', function() {
            // Mover el contenedor hacia la izquierda
            songlist.scrollBy({
                top: 0,
                left: -500, // Ajusta el valor según la cantidad de desplazamiento deseada
                behavior: 'smooth'
            });
        });

        scrollRightButton.addEventListener('click', function() {
            // Mover el contenedor hacia la derecha
            songlist.scrollBy({
                top: 0,
                left: 500, // Ajusta el valor según la cantidad de desplazamiento deseada
                behavior: 'smooth'
            });
        });
    }
});
