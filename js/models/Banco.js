//4-banco
// admin usuarios, cuentas y movimientos

import { Movimiento } from "./Movimiento.js";

export class Banco {

    constructor({
        usuarios = [],
        cuentas = [],
        movimientos = []
    } = {}) {
        this.usuarios = usuarios;
        this.cuentas = cuentas;
        this.movimientos = movimientos;
    }

    // add usuario
    agregarUsuario(usuario) {
        const existe = this.usuarios.some(
            (u) => u.id === usuario.id
        );

        if (existe) {
            throw new Error("El usuario ya existe.");
        }

        this.usuarios.push(usuario);
        return usuario;
    }

    // buscar usuario por id
    buscarUsuarioPorId(usuarioId) {
        return this.usuarios.find(
            (usuario) => usuario.id === usuarioId
        ) || null;
    }

    // add cuenta
    agregarCuenta(cuenta) {
        const usuario = this.buscarUsuarioPorId(
            cuenta.usuarioId
        );

        if (!usuario) {
            throw new Error(
                "El usuario propietario de la cuenta no existe."
            );
        }

        const existe = this.cuentas.some(
            (c) =>
                c.id === cuenta.id ||
                c.numeroCuenta === cuenta.numeroCuenta
        );

        if (existe) {
            throw new Error("La cuenta ya existe.");
        }

        this.cuentas.push(cuenta);
        return cuenta;
    }

    // Buscar cuenta por id
    buscarCuentaPorId(cuentaId) {
        return this.cuentas.find(
            (cuenta) => cuenta.id === cuentaId
        ) || null;
    }

    // Buscar cuenta por numero
    buscarCuentaPorNumero(numeroCuenta) {
        return this.cuentas.find(
            (cuenta) => cuenta.numeroCuenta === numeroCuenta
        ) || null;
    }

    // Obtener cuentas de un usuario
    obtenerCuentasDeUsuario(usuarioId) {
        return this.cuentas.filter(
            (cuenta) => cuenta.usuarioId === usuarioId
        );
    }

    // registrar movimiento s*
    registrarMovimiento(movimiento) {
        this.movimientos.push(movimiento);
        return movimiento;
    }

    // Realizar deposito
    realizarDeposito({
        cuentaId,
        monto,
        descripcion = ""
    }) {
        const montoNumerico = Number(monto);

        // validar el monto
        if (
            !Number.isFinite(montoNumerico) ||
            montoNumerico <= 0
        ) {
            throw new Error(
                "Monto inválido, el monto debe ser mayor a cero."
            );
        }

        // Buscar cuenta
        const cuenta = this.buscarCuentaPorId(cuentaId);

        if (!cuenta) {
            throw new Error("La cuenta no existe.");
        }

        // actualizar saldo
        cuenta.depositar(montoNumerico);

        // Crear movimiento automaticamente
        const movimiento = new Movimiento({
            tipo: "DEPOSITO",
            monto: montoNumerico,
            descripcion,
            cuentaOrigen: cuenta.id,
            saldoResultante: cuenta.saldo
        });

        // Guardar movimiento
        this.registrarMovimiento(movimiento);

        return movimiento;
    }

    // y obtener movimientos de una cuenta
    obtenerMovimientosDeCuenta(cuentaId) {
        return this.movimientos.filter(
            (movimiento) =>
                movimiento.cuentaOrigen === cuentaId ||
                movimiento.cuentaDestino === cuentaId
        );
    }
}
