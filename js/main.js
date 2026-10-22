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

//imports models
import { Usuario } from "./models/Usuario.js";
import { Cuenta } from "./models/Cuenta.js";
import { Movimiento } from "./models/Movimiento.js";
import{Banco } from"./models/Banco.js";

//verificamos con console.log y comprobamos
console.log("Sistema de Gestión Bancaria - v0.4.0");

console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital")
);


console.log("Monto válido:", validarMonto(1000));

console.log("ID generado:", generarId());

console.log("Monto formateado:", formatCurrency(1500));

console.log("Fecha formateada:", formatDate(new Date()));

console.log("Número de cuenta:", formatAccountNumber("123456789012"));

//crear banko
const bancoDemo = new Banco();


// Crear usuario de ejemplo
const usuarioDemo = new Usuario({
    nombre: "yamileth Acevedo",
    email: "yamii@gmail.com",
    telefono: "2747412397",
    password: "122347"
});

//registrar usuario en el banco
bancoDemo.agregarUsuario(usuarioDemo);
//comprobamos banco
console.log(
    "Usuarios registrados:",
    bancoDemo.usuarios
);

console.log("Usuario:", usuarioDemo);
// Crear cuenta bank
const cuentaDemo = new Cuenta({
    numeroCuenta: "123456789012",
    usuarioId: usuarioDemo.id
});

//registro en cuenta banco
bancoDemo.agregarCuenta(cuentaDemo);
console.log(
    "Cuentas registradas:",
    bancoDemo.cuentas
);


// Realizar deposito desde banco
const depositoDemo = bancoDemo.realizarDeposito({
    cuentaId: cuentaDemo.id,
    monto: 5000,
    descripcion: "Depósito inicial"
});

// Mostrar saldo
console.log(
    "Saldo actual:",
    formatCurrency(cuentaDemo.saldo)
);

// muestra movimiento generado
console.log(
    "Movimiento generado:",
    depositoDemo
);

// muestra movimientos registrados
console.log(
    "Movimientos registrados:",
    bancoDemo.movimientos
);

// Buscar usuario por id
const usuarioEncontrado = bancoDemo.buscarUsuarioPorId(
    usuarioDemo.id
);

console.log(
    "El usuario ha sido encontrado:",
    usuarioEncontrado
);

// Obtener cuentas del usuario
const cuentasUsuario = bancoDemo.obtenerCuentasDeUsuario(
    usuarioDemo.id
);

console.log(
    "Cuentas del usuario:",
    cuentasUsuario
);

// Probar un deposito invalido por comprobacion
try {
    bancoDemo.realizarDeposito({
        cuentaId: cuentaDemo.id,
        monto: -500
    });
} catch (error) {
    console.log(
        "Error :",
        error.message
    );
}