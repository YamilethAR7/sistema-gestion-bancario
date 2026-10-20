// versión v0.5.0 - Sistema de Gestión Bancaria


// Importar utilidades
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

// Importar modelos
import { Usuario } from "./models/Usuario.js";
import { Cuenta } from "./models/Cuenta.js";
import { Movimiento } from "./models/Movimiento.js";
import { Banco } from "./models/Banco.js";


import {
    STORAGE_KEYS,
    storageService
} from "./services/StorageService.js";


// Comprobar utilidades
console.log("Sistema de Gestión Bancaria - v0.5.0");

console.log(
    "Campo obligatorio:",
    validarCampoObligatorio("Banco Digital")
);


console.log("Monto válido:", validarMonto(1000));

console.log("ID generado:", generarId());

console.log("Monto formateado:", formatCurrency(1500));

console.log("Fecha formateada:", formatDate(new Date()));


console.log(
    "Número de cuenta:",
    formatAccountNumber("123456789012")
);

// Guardar el estado del banco
function guardarBanco(banco) {

    // Guardar usuarios
    storageService.guardar(
        STORAGE_KEYS.USUARIOS,
        banco.usuarios
    );

    // Guardar cuentas
    storageService.guardar(
        STORAGE_KEYS.CUENTAS,
        banco.cuentas
    );

    // Guardar movimientos
    storageService.guardar(
        STORAGE_KEYS.MOVIMIENTOS,
        banco.movimientos
    );
}

// Recuperar el banco desde LocalStorage
function cargarBanco() {

    const usuariosGuardados = storageService.obtener(
        STORAGE_KEYS.USUARIOS,
        []
    );

    const cuentasGuardadas = storageService.obtener(
        STORAGE_KEYS.CUENTAS,
        []
    );

    const movimientosGuardados = storageService.obtener(
        STORAGE_KEYS.MOVIMIENTOS,
        []
    );

    // reconstruir instancias de Usuario
    const usuarios = usuariosGuardados.map(
        (usuario) => new Usuario(usuario)
    );

    // reconstruir instancias de Cuenta
    const cuentas = cuentasGuardadas.map(
        (cuenta) => new Cuenta(cuenta)
    );

    // Reconstruir instancias de Movimiento
    const movimientos = movimientosGuardados.map(
        (movimiento) => new Movimiento(movimiento)
    );

    // Crear banco con los datos recuperados
    return new Banco({
        usuarios,
        cuentas,
        movimientos
    });
}

// Cargar el bank
const bancoDemo = cargarBanco();

// Crear datos de ejemplo solamente si no existen usuarios
if (bancoDemo.usuarios.length === 0) {

    // Crear usuario de demostración
    const usuarioDemo = new Usuario({
        nombre: "Juan Suarez",
        email: "juan@correo.com",
        telefono: "5512345678",
        password: "123456"
    });

    bancoDemo.agregarUsuario(usuarioDemo);

    // Crear cuenta
    const cuentaDemo = new Cuenta({
        numeroCuenta: "123456789012",
        usuarioId: usuarioDemo.id
    });

    bancoDemo.agregarCuenta(cuentaDemo);

    // Realizar depósito inicial
    bancoDemo.realizarDeposito({
        cuentaId: cuentaDemo.id,
        monto: 5000,
        descripcion: "Depósito inicial"
    });

    // Guardar datos en LocalStorage
    guardarBanco(bancoDemo);
}

// Mostrar información recuperada
console.log("Banco recuperado:", bancoDemo);

console.log(
    "Usuarios almacenados:",
    bancoDemo.usuarios
);


console.log(
    "Cuentas almacenadas:",
    bancoDemo.cuentas
);



console.log(
    "Movimientos almacenados:",
    bancoDemo.movimientos
);

// Obtener primera cuenta
const cuentaPrincipal = bancoDemo.cuentas[0] || null;

if (cuentaPrincipal) {

    console.log(
        "Saldo persistido:",
        formatCurrency(cuentaPrincipal.saldo)
    );

    // Comprobar que recuperamos la clase Cuenta
    console.log(
        "¿La cuenta sigue siendo instancia de Cuenta?",
        cuentaPrincipal instanceof Cuenta
    );

    // Comprobar que conserva sus métodos
    console.log(
        "Método depositar:",
        typeof cuentaPrincipal.depositar
    );
}
