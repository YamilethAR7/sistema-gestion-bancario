// Módulo 4 - Sistema de Gestión Bancaria
// Versión v0.1.0 a 5/ actual versión v0.3.0
// xconsola que muestra la ui de la version que voy elabo

//primero imports como JMa
import {
    validarCampoObligatorio,
    validarMonto
} from "./utils/validadores.js";

import { generarId } from "./utils/auxiliares.js";

import {
    formatCurrency,
    formatDate,
    formatAccountNumber
} from "./utils/formateador.js";

import { Usuario } from "./models/Usuario.js";
import { Cuenta } from "./models/Cuenta.js";
import { Movimiento } from "./models/Movimiento.js";


//verificamos con console.log y comprobamos
console.log("Sistema de Gestión Bancaria - v0.3.0");
console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital"));

console.log("Monto válido:", validarMonto(1000));

console.log("ID generado:", generarId());

console.log("Monto formateado:", formatCurrency(1500));

console.log("Fecha formateada:", formatDate(new Date()));

console.log("Número de cuenta:", formatAccountNumber("123456789012"));

// Crear usuario de ejemplo
const usuarioDemo = new Usuario({
    nombre: "yamileth Acevedo",
    email: "yamii@gmail.com",
    telefono: "2747412397",
    password: "122347"
});

console.log("Usuario:", usuarioDemo);
// Crear cuenta bank
const cuentaDemo = new Cuenta({
    numeroCuenta: "123456789012",
    usuarioId: usuarioDemo.id
});

console.log("Cuenta:", cuentaDemo);
// Realizar un depósito
cuentaDemo.depositar(5000);

console.log(
    "Saldo después del depósito:",
    formatCurrency(cuentaDemo.saldo)
);
// Crear movimiento
const movimientoDemo = new Movimiento({
    tipo: "DEPOSITO",
    monto: 5000,
    descripcion: "Depósito inicial",
    cuentaOrigen: cuentaDemo.id,
    saldoResultante: cuentaDemo.saldo
});

console.log("Movimiento:", movimientoDemo);
// Comprobar relaciones entre movimientos
console.log(
    "Cuenta pertenece al usuario:",
    usuarioDemo.id === cuentaDemo.usuarioId
);

console.log(
    "Movimiento pertenece a la cuenta:",
    cuentaDemo.id === movimientoDemo.cuentaOrigen
);
