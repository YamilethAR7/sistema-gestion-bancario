
// version v0.10.0
// servicio para admin la info bancaria

import { Banco } from "../models/Banco.js";
import { Usuario } from "../models/Usuario.js";
import { Cuenta } from "../models/Cuenta.js";
import { Movimiento } from "../models/Movimiento.js";

import {
    STORAGE_KEYS,
    storageService
} from "./StorageService.js";

class BancoService {

    constructor() {
        this._banco = null;
    }

    // recuprar info desde LocalStorage
    cargarBanco() {
        const usuariosGuardados = storageService.obtener(
            STORAGE_KEYS.USUARIOS, []
        );

        const cuentasGuardadas = storageService.obtener(
            STORAGE_KEYS.CUENTAS, []
        );

        const movimientosGuardados = storageService.obtener(
            STORAGE_KEYS.MOVIMIENTOS, []
        );

        // reconstruir las clases
        const usuarios = usuariosGuardados.map(
            (usuario) => new Usuario(usuario)
        );

        const cuentas = cuentasGuardadas.map(
            (cuenta) => new Cuenta(cuenta)
        );

        const movimientos = movimientosGuardados.map(
            (movimiento) => new Movimiento(movimiento)
        );

        this._banco = new Banco({
            usuarios,
            cuentas,
            movimientos
        });

        return this._banco;
    }

    // obtener la instancia del banco
    obtenerInstanciaBanco() {
        if (!this._banco) {
            return this.cargarBanco();
        }

        return this._banco;
    }

    // recargamos datos del banco
    recargarBanco() {
        this._banco = null;
        return this.cargarBanco();
    }

    // Guardar info
    guardarBanco() {
        const banco = this.obtenerInstanciaBanco();

        storageService.guardar(
            STORAGE_KEYS.USUARIOS, banco.usuarios
        );

        storageService.guardar(
            STORAGE_KEYS.CUENTAS, banco.cuentas
        );

        storageService.guardar(
            STORAGE_KEYS.MOVIMIENTOS, banco.movimientos
        );

        return true;
    }

    // obt info de un usuario
    obtenerDatosUsuario(usuarioId) {
        const banco = this.obtenerInstanciaBanco();

        const usuario = banco.buscarUsuarioPorId(usuarioId);

        if (!usuario) {
            throw new Error("El usuario no existe.");
        }

        const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

        // obt ids de sus cuentas
        const cuentasIds = cuentas.map(
            (cuenta) => cuenta.id
        );

        // obt movimientos del usuario
        const movimientos = banco.movimientos.filter(
            (movimiento) => {

                if (movimiento.tipo === "DEPOSITO") {
                    return cuentasIds.includes(
                        movimiento.cuentaOrigen
                    );
                }

                if (movimiento.tipo === "TRANSFERENCIA_ENVIADA") {
                    return cuentasIds.includes(
                        movimiento.cuentaOrigen
                    );
                }

                if (movimiento.tipo === "TRANSFERENCIA_RECIBIDA") {
                    return cuentasIds.includes(
                        movimiento.cuentaDestino
                    );
                }

                return false;
            }
        );

        return {
            usuario,
            cuentas,
            movimientos
        };
    }

    // obt resumen para el Dashboard
    obtenerResumenUsuario(usuarioId) {
        const {
            usuario,
            cuentas,
            movimientos
        } = this.obtenerDatosUsuario(usuarioId);

        // contante para sumar los saldos
        const saldoTotal = cuentas.reduce(
            (acumulado, cuenta) =>
                acumulado + Number(cuenta.saldo),
            0
        );

        return {
            usuario,
            cuentas,
            movimientos,
            saldoTotal,
            totalCuentas: cuentas.length,
            totalMovimientos: movimientos.length
        };
    }

    // vers10
    // obt movimientos y filtrarlos
    obtenerMovimientosUsuario(usuarioId, tipo = "TODOS") {
        const { movimientos } = this.obtenerDatosUsuario(usuarioId);

        let resultado = [...movimientos];

        // filtrar por tipo
        if (tipo !== "TODOS") {
            resultado = resultado.filter(
                (movimiento) => movimiento.tipo === tipo
            );
        }

        // ordenar por fecha
        resultado.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );

        return resultado;
    }

    // resumen de movimientos
    obtenerResumenMovimientos(usuarioId) {
        const movimientos = this.obtenerMovimientosUsuario(usuarioId);

        const depositos = movimientos.filter(
            (movimiento) => movimiento.tipo === "DEPOSITO"
        ).length;

        const enviadas = movimientos.filter(
            (movimiento) =>
                movimiento.tipo === "TRANSFERENCIA_ENVIADA"
        ).length;

        const recibidas = movimientos.filter(
            (movimiento) =>
                movimiento.tipo === "TRANSFERENCIA_RECIBIDA"
        ).length;

        return {
            total: movimientos.length,
            depositos,
            enviadas,
            recibidas
        };
    }

    //vers9
    // realizar depósito
    realizarDeposito({
        cuentaId,
        monto,
        descripcion = ""
    }) {
        const banco = this.obtenerInstanciaBanco();

        const movimiento = banco.realizarDeposito({
            cuentaId,
            monto,
            descripcion
        });

        // Guardar saldo y movimiento
        this.guardarBanco();

        return movimiento;
    }

    // v9 - realiza transferencia
    realizarTransferencia({
        cuentaOrigenId,
        numeroCuentaDestino,
        monto,
        descripcion = ""
    }) {
        const banco = this.obtenerInstanciaBanco();

        // eliminar espacios del número de cuenta
        const numeroDestino = String(numeroCuentaDestino)
            .replace(/\s/g, "")
            .trim();

        // busca cuenta destino
        const cuentaDestino = banco.buscarCuentaPorNumero(
            numeroDestino
        );

        if (!cuentaDestino) {
            throw new Error("La cuenta destino no existe.");
        }

        // realizamos transferencia
        const resultado = banco.realizarTransferencia({
            cuentaOrigenId,
            cuentaDestinoId: cuentaDestino.id,
            monto,
            descripcion
        });

        // Guardar nuevos saldos y movimientos
        this.guardarBanco();

        return resultado;
    }

    // Actualizar info personal vers8
    actualizarUsuario(usuarioId, { nombre, email, telefono }) {
        const usuarios = storageService.obtener(
            STORAGE_KEYS.USUARIOS, []
        );

        const usuario = usuarios.find(
            (item) => item.id === usuarioId
        );

        if (!usuario) {
            throw new Error("El usuario no existe.");
        }

        const emailNormalizado = String(email).trim().toLowerCase();

        const emailDuplicado = usuarios.some(
            (item) =>
                item.email.toLowerCase() === emailNormalizado &&
                item.id !== usuarioId
        );

        if (emailDuplicado) {
            throw new Error("Ya existe un usuario con este correo.");
        }

        const usuariosActualizados = usuarios.map(
            (item) =>
                item.id === usuarioId
                    ? {
                        ...item,
                        nombre: nombre.trim(),
                        email: emailNormalizado,
                        telefono: telefono.trim()
                    }
                    : item
        );

        storageService.guardar(
            STORAGE_KEYS.USUARIOS,
            usuariosActualizados
        );

        this.recargarBanco();

        return usuariosActualizados.find(
            (item) => item.id === usuarioId
        ) || null;
    }

    // Cambiar contraseña
    cambiarPassword(usuarioId, passwordActual, passwordNueva) {
        const usuarios = storageService.obtener(
            STORAGE_KEYS.USUARIOS, []
        );

        const usuario = usuarios.find(
            (item) => item.id === usuarioId
        );

        if (!usuario) {
            throw new Error("El usuario no existe.");
        }

        if (usuario.password !== passwordActual) {
            throw new Error("La contraseña actual no es correcta.");
        }

        if (passwordNueva === passwordActual) {
            throw new Error("La nueva contraseña debe ser diferente.");
        }

        if (passwordNueva.length < 6) {
            throw new Error(
                "La nueva contraseña debe tener al menos 6 caracteres."
            );
        }

        const usuariosActualizados = usuarios.map(
            (item) =>
                item.id === usuarioId
                    ? { ...item, password: passwordNueva }
                    : item
        );

        storageService.guardar(
            STORAGE_KEYS.USUARIOS,
            usuariosActualizados
        );

        this.recargarBanco();

        return true;
    }

    // Eliminar usuario y sus datos relacionados
    eliminarUsuario(usuarioId) {
        const usuarios = storageService.obtener(
            STORAGE_KEYS.USUARIOS, []
        );

        const cuentas = storageService.obtener(
            STORAGE_KEYS.CUENTAS, []
        );

        const movimientos = storageService.obtener(
            STORAGE_KEYS.MOVIMIENTOS, []
        );

        const usuario = usuarios.find(
            (item) => item.id === usuarioId
        );

        if (!usuario) {
            throw new Error("El usuario no existe.");
        }

        const cuentasUsuario = cuentas.filter(
            (cuenta) => cuenta.usuarioId === usuarioId
        );

        const tieneSaldo = cuentasUsuario.some(
            (cuenta) => Number(cuenta.saldo) > 0
        );

        if (tieneSaldo) {
            throw new Error(
                "No puedes eliminar tu cuenta mientras tengas saldo disponible."
            );
        }

        const cuentasUsuarioIds = cuentasUsuario.map(
            (cuenta) => cuenta.id
        );

        const usuariosFiltrados = usuarios.filter(
            (item) => item.id !== usuarioId
        );

        const cuentasFiltradas = cuentas.filter(
            (cuenta) => cuenta.usuarioId !== usuarioId
        );

        const movimientosFiltrados = movimientos.filter(
            (movimiento) =>
                !cuentasUsuarioIds.includes(movimiento.cuentaOrigen) &&
                !cuentasUsuarioIds.includes(movimiento.cuentaDestino)
        );

        storageService.guardar(
            STORAGE_KEYS.USUARIOS,
            usuariosFiltrados
        );

        storageService.guardar(
            STORAGE_KEYS.CUENTAS,
            cuentasFiltradas
        );

        storageService.guardar(
            STORAGE_KEYS.MOVIMIENTOS,
            movimientosFiltrados
        );

        this.recargarBanco();

        return true;
    }
}

// exportamos instancia del servicio
export const bancoService = new BancoService();
