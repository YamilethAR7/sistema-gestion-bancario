// version v0.7.0 UI del Dashboard bancario

import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

import {
    formatCurrency,
    formatAccountNumber
} from "../utils/formateador.js";

// Mostrar info del usuario
function renderDashboard(resumen) {

    const root = document.querySelector("#dashboardRoot");

    if (!root) {
        return;
    }

    const {
        usuario,
        cuentas,
        saldoTotal,
        totalCuentas,
        totalMovimientos
    } = resumen;

    // Obtener  laprimera cuenta
    const cuentaPrincipal = cuentas[0] || null;

    // generamos el contenido HTML
    root.innerHTML = `
        <section class="dashboard-welcome">
            <div>
                <p class="dashboard-label">
                    Bienvenido
                </p>

                <h2 id="saludoUsuario"></h2>

                <p>
                    Consulta el estado actual de tus cuentas.
                </p>
            </div>
        </section>

        <section class="summary-grid">

            <article class="summary-card">
                <span>Saldo total</span>
                <strong>${formatCurrency(saldoTotal)}</strong>
            </article>

            <article class="summary-card">
                <span>Cuentas</span>
                <strong>${totalCuentas}</strong>
            </article>

            <article class="summary-card">
                <span>Movimientos</span>
                <strong>${totalMovimientos}</strong>
            </article>

        </section>

        <section class="dashboard-section">

            <header class="section-header">
                <div>
                    <span>Cuenta principal</span>
                    <h3>Información bancaria</h3>
                </div>
            </header>

            ${
                cuentaPrincipal
                ? `
                    <article class="account-card">

                        <div>
                            <span>Número de cuenta</span>
                            <strong>
                                ${formatAccountNumber(
                                    cuentaPrincipal.numeroCuenta
                                )}
                            </strong>
                        </div>

                        <div>
                            <span>Tipo</span>
                            <strong id="tipoCuenta"></strong>
                        </div>

                        <div>
                            <span>Saldo disponible</span>
                            <strong>
                                ${formatCurrency(
                                    cuentaPrincipal.saldo
                                )}
                            </strong>
                        </div>

                    </article>
                `
                : `
                    <p>
                        No tienes cuentas bancarias registradas.
                    </p>
                `
            }

        </section>
    `;

    // muestra textos del usuario de forma segura
    document.querySelector("#saludoUsuario").textContent =
        usuario.nombre;

    if (cuentaPrincipal) {
        document.querySelector("#tipoCuenta").textContent =
            cuentaPrincipal.tipo;
    }
}

// config cierre de sesion
function initLogout() {

    const btn = document.querySelector("#logoutBtn");

    if (!btn) {
        return;
    }

    btn.addEventListener("click", () => {

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

            authService.logout();

            window.location.href = "index.html";
        });
    });
}

// iniciamos con el Dashboard
function init() {

    const accesoPermitido = authService.protegerRuta();

    if (!accesoPermitido) {
        return;
    }

    const usuario = authService.getCurrentUser();

    if (!usuario) {
        return;
    }

    try {
        // recuperamos datos actualizados
        bancoService.recargarBanco();

        const resumen = bancoService.obtenerResumenUsuario(
            usuario.id
        );

        // mostramos el Dashboard
        renderDashboard(resumen);

        // activamos btn de salida
        initLogout();

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "No fue posible cargar el dashboard",
            text: error.message
        });
    }
}

init();
