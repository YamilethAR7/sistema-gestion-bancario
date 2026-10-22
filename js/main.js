// Módulo 4 - Sistema de Gestión Bancaria
// Versión v0.1.0 a 5
// // xconsola que muestra la ui de la version que voy elabo-
console.log("Sistema de Gestión Bancaria - v0.2.0");
console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital"));

console.log("Monto válido:", validarMonto(1000));

console.log("ID generado:", generarId());

console.log("Monto formateado:", formatCurrency(1500));

console.log("Fecha formateada:", formatDate(new Date()));

console.log("Número de cuenta:", formatAccountNumber("123456789012"));

import {
    validarCampoObligatorio,
    validarMonto
} from "./utils/validadores.js";

import { generarId } from "./utils/auxiliares.js"

import {
    formatCurrency,
    formatDate,
    formatAccountNumber
} from "./utils/formateador.js";