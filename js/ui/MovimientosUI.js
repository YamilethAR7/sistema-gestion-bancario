
// version v0.10.0
// mostrar historial y filtrar movimientos

import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";

import {
    formatCurrency,
    formatDate
} from "../utils/formateador.js";

// filtro que se esta usando
let filtroActual = "TODOS";

// cerrar sesion
function initLogout() {
    const btn = document.querySelector("#logoutBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {
        Swal.fire({
            icon: "question",
            title: "Cerrar sesión",
            text: "¿Seguro que deseas salir?",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (!result.isConfirmed) return;

            authService.logout();
            window.location.href = "index.html";
        });
    });
}

// nombres de movimientos
function obtenerEtiquetaTipo(tipo) {
    const etiquetas = {
        DEPOSITO: "Depósito",
        TRANSFERENCIA_ENVIADA: "Transferencia enviada",
        TRANSFERENCIA_RECIBIDA: "Transferencia recibida"
    };

    return etiquetas[tipo] || tipo;
}

// signo del movimiento
function obtenerSignoMovimiento(tipo) {
    if (tipo === "TRANSFERENCIA_ENVIADA") {
        return "-";
    }

    return "+";
}

// clase para mostrar entrada o salida
function obtenerClaseMovimiento(tipo) {
    if (tipo === "TRANSFERENCIA_ENVIADA") {
        return "movimiento-salida";
    }

    return "movimiento-entrada";
}

// evitar insertar texto como html
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, (caracter) => {
        const cambios = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return cambios[caracter];
    });
}

// mostrar historial
function renderMovimientos(usuario) {
    const root = document.querySelector("#movimientosRoot");

    if (!root) return;

    const resumen = bancoService.obtenerResumenMovimientos(
        usuario.id
    );

    const movimientos = bancoService.obtenerMovimientosUsuario(
        usuario.id,
        filtroActual
    );

    root.innerHTML = `
        <!-- titulo -->
        <section class="movimientos-header">
            <span class="dashboard-label">
                Actividad bancaria
            </span>

            <h2>Historial de movimientos</h2>

            <p>
                Consulta las operaciones realizadas en tus cuentas.
            </p>
        </section>

        <!-- resumen -->
        <section class="movimientos-summary">
            <article class="movimiento-summary-card">
                <span>Todos</span>
                <strong>${resumen.total}</strong>
            </article>

            <article class="movimiento-summary-card">
                <span>Depósitos</span>
                <strong>${resumen.depositos}</strong>
            </article>

            <article class="movimiento-summary-card">
                <span>Enviadas</span>
                <strong>${resumen.enviadas}</strong>
            </article>

            <article class="movimiento-summary-card">
                <span>Recibidas</span>
                <strong>${resumen.recibidas}</strong>
            </article>
        </section>

        <!-- filtros y tabla -->
        <section class="movimientos-panel">
            <header class="movimientos-toolbar">
                <div>
                    <h3>Operaciones</h3>
                    <p>Filtra el historial por tipo de movimiento.</p>
                </div>

                <div class="movimientos-filtros">
                    <button type="button"
                        class="filtro-btn ${filtroActual === "TODOS" ? "active" : ""}"
                        data-filtro="TODOS">
                        Todos
                    </button>

                    <button type="button"
                        class="filtro-btn ${filtroActual === "DEPOSITO" ? "active" : ""}"
                        data-filtro="DEPOSITO">
                        Depósitos
                    </button>

                    <button type="button"
                        class="filtro-btn ${filtroActual === "TRANSFERENCIA_ENVIADA" ? "active" : ""}"
                        data-filtro="TRANSFERENCIA_ENVIADA">
                        Enviadas
                    </button>

                    <button type="button"
                        class="filtro-btn ${filtroActual === "TRANSFERENCIA_RECIBIDA" ? "active" : ""}"
                        data-filtro="TRANSFERENCIA_RECIBIDA">
                        Recibidas
                    </button>
                </div>
            </header>

            ${
                movimientos.length === 0
                ? `
                    <div class="movimientos-empty">
                        <strong>
                            No hay movimientos para mostrar.
                        </strong>

                        <p>
                            Realiza un depósito o una transferencia
                            para generar actividad.
                        </p>
                    </div>
                `
                : `
                    <div class="table-wrapper">
                        <table class="movimientos-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                    <th>Saldo</th>
                                </tr>
                            </thead>

                            <tbody>
                                ${movimientos.map((movimiento) => {
                                    const signo = obtenerSignoMovimiento(
                                        movimiento.tipo
                                    );

                                    const clase = obtenerClaseMovimiento(
                                        movimiento.tipo
                                    );

                                    return `
                                        <tr>
                                            <td>
                                                ${formatDate(movimiento.fecha)}
                                            </td>

                                            <td>
                                                <span class="movimiento-tipo ${clase}">
                                                    ${obtenerEtiquetaTipo(movimiento.tipo)}
                                                </span>
                                            </td>

                                            <td>
                                                ${escaparHTML(
                                                    movimiento.descripcion || "Sin descripción"
                                                )}
                                            </td>

                                            <td class="movimiento-monto ${clase}">
                                                ${signo}${formatCurrency(movimiento.monto)}
                                            </td>

                                            <td>
                                                ${formatCurrency(movimiento.saldoResultante)}
                                            </td>
                                        </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>
                `
            }
        </section>
    `;

    initFiltros(usuario);
}

// eventos de filtros
function initFiltros(usuario) {
    const botones = document.querySelectorAll("[data-filtro]");

    botones.forEach((boton) => {
        boton.addEventListener("click", () => {
            filtroActual = boton.dataset.filtro;
            renderMovimientos(usuario);
        });
    });
}

// iniciar pagina
function init() {
    const accesoPermitido = authService.protegerRuta();

    if (!accesoPermitido) return;

    initLogout();

    const usuario = authService.getCurrentUser();

    if (!usuario) return;

    try {
        bancoService.recargarBanco();
        renderMovimientos(usuario);

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "No fue posible cargar los movimientos",
            text: error.message
        });
    }
}

// ejecutar solo en movimientos
if (document.querySelector(".app-movimientos")) {
    init();
}
