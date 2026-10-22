// modulo 4 - Sistema de Gestión Bancaria
// version v0.6.0 - regsitro e inicio de sesión

// Importar modelos
import { Usuario } from "./models/Usuario.js";

import { Cuenta } from "./models/Cuenta.js";



// importar utilidades
import { generarNumeroCuenta } from "./utils/auxiliares.js";
import { validarCampoObligatorio } from "./utils/validadores.js";

// importar servicios
import {
    STORAGE_KEYS,
    storageService
} from "./services/StorageService.js";

import { authService } from "./services/AuthService.js";

// preparar LocalStorage
function inicializarStorage() {

    const usuarios = storageService.obtener(
        STORAGE_KEYS.USUARIOS,
        null
    );

    const cuentas = storageService.obtener(
        STORAGE_KEYS.CUENTAS,
        null
    );

    const movimientos = storageService.obtener(
        STORAGE_KEYS.MOVIMIENTOS,
        null
    );

    if (usuarios === null) {
        storageService.guardar(STORAGE_KEYS.USUARIOS, []);
    }

    if (cuentas === null) {
        storageService.guardar(STORAGE_KEYS.CUENTAS, []);
    }

    if (movimientos === null) {
        storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, []);
    }
}

// registra new usuario
function manejarRegistro(event) {
    event.preventDefault();

    // obtener datos del form
    const nombre = document.querySelector("#registroNombre")
        .value.trim();

    const email = document.querySelector("#registroEmail")
        .value.trim().toLowerCase();

    const telefono = document.querySelector("#registroTelefono")
        .value.trim();

    const password = document.querySelector("#registroPassword")
        .value;

    const confirmarPassword = document.querySelector(
        "#registroConfirmPassword"
    ).value;

    // validamos campos obligatorios a llenar
    if (
        !validarCampoObligatorio(nombre) ||
        !validarCampoObligatorio(email) ||
        !validarCampoObligatorio(password)
    ) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Completa los campos obligatorios."
        });
        return;
    }

    // validamos longitud de contraseña
    if (password.length < 6) {
        Swal.fire({
            icon: "warning",
            title: "Contraseña inválida",
            text: "La contraseña debe tener al menos 6 caracteres."
        });
        return;
    }

    // confirmamos contraseñas
    if (password !== confirmarPassword) {
        Swal.fire({
            icon: "warning",
            title: "Contraseñas diferentes",
            text: "Las contraseñas no coinciden."
        });
        return;
    }

    // recuperacion usuarios
    const usuarios = storageService.obtener(
        STORAGE_KEYS.USUARIOS,
        []
    );

    // evitamos correos duplicados
    const emailExistente = usuarios.some(
        (usuario) => usuario.email.toLowerCase() === email
    );

    if (emailExistente) {
        Swal.fire({
            icon: "error",
            title: "Correo registrado",
            text: "Ya existe un usuario con este correo."
        });
        return;
    }

    // crear usuario
    const nuevoUsuario = new Usuario({
        nombre,
        email,
        telefono,
        password
    });

    // generar numero de cuenta unico
    const cuentas = storageService.obtener(
        STORAGE_KEYS.CUENTAS,
        []
    );

    let numeroCuenta;

    do {
        numeroCuenta = generarNumeroCuenta();
    } while (
        cuentas.some(
            (cuenta) => cuenta.numeroCuenta === numeroCuenta
        )
    );

    // crear cuenta bancaria
    const nuevaCuenta = new Cuenta({
        numeroCuenta,
        tipo: "Ahorro",
        saldo: 0,
        usuarioId: nuevoUsuario.id
    });

    // agregar a los arrayss
    usuarios.push(nuevoUsuario);
    cuentas.push(nuevaCuenta);

    // guardar en LocalStorage
    storageService.guardar(
        STORAGE_KEYS.USUARIOS,
        usuarios
    );

    storageService.guardar(
        STORAGE_KEYS.CUENTAS,
        cuentas
    );

    // mostrar registro con exito
    Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Tu usuario y cuenta bancaria fueron creados correctamente.",
        confirmButtonText: "Continuar"
    }).then(() => {

        // limpiamos formulario
        document.querySelector("#formRegistro").reset();

        // ponemos el correo en el login
        document.querySelector("#loginEmail").value = email;
    });
}

// incio sesión
function manejarLogin(event) {
    event.preventDefault();

    const email = document.querySelector("#loginEmail")
        .value.trim().toLowerCase();

    const password = document.querySelector("#loginPassword")
        .value;

    // validamos los campos
    if (
        !validarCampoObligatorio(email) ||
        !validarCampoObligatorio(password)
    ) {
        Swal.fire({
            icon: "warning",
            title: "Campos incompletos",
            text: "Ingresa tu correo y contraseña."
        });
        return;
    }

    try {
        // autentica al usuario
        const usuario = authService.login(email, password);

        // mensaje de welcome
        Swal.fire({
            icon: "success",
            title: `Bienvenido, ${usuario.nombre}`,
            text: "Inicio de sesión correcto.",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            window.location.href = "dashboard.html";
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "No fue posible iniciar sesión",
            text: error.message
        });
    }
}

// inicializacion app/web
function init() {

    inicializarStorage();

    // comprobamos si ya existe una sesion
    if (authService.getCurrentUser()) {
        window.location.href = "dashboard.html";
        return;
    }

    // obt form
    const formLogin = document.querySelector("#formLogin");
    const formRegistro = document.querySelector("#formRegistro");

    // registrar eventos
    if (formLogin) {
        formLogin.addEventListener("submit", manejarLogin);
    }

    if (formRegistro) {
        formRegistro.addEventListener("submit", manejarRegistro);
    }
}

// ejecutamos pag
init();
