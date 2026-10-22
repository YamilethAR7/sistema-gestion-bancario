// version v0.6.0
// Interfaz del Dashboard UI

import { authService } from "../services/AuthService.js";

// mostrar usuario que incio sesion
function mostrarUsuario() {

    const usuario = authService.getCurrentUser();

    if (!usuario) {
        return;
    }

    const nombreUsuario = document.querySelector(
        "#nombreUsuario"
    );

    if (nombreUsuario) {
        nombreUsuario.textContent =
            `Sesión iniciada como ${usuario.nombre}`;
    }
}

// evento para cerrar la sesion
function inicializarLogout() {

    const logoutBtn = document.querySelector("#logoutBtn");

    if (!logoutBtn) {
        return;
    }

    logoutBtn.addEventListener("click", () => {

        Swal.fire({
            icon: "question",
            title: "Cerrar sesión",
            text: "¿Seguro que deseas salir?",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {

            if (!result.isConfirmed) {
                return;
            }

            // Eliminar sesión
            authService.logout();

            // Regresar al inicio
            window.location.href = "index.html";
        });
    });
}

// iniciamos el Dashboard
function init() {

    const accesoPermitido = authService.protegerRuta();

    if (!accesoPermitido) {
        return;
    }

    mostrarUsuario();
    inicializarLogout();
}

init();
