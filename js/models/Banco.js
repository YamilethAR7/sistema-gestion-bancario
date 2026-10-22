
// version v0.9.0 - Banco
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

    // registrar movimiento
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

    // version v0.9.0 - Realizar transferencia
    realizarTransferencia({
        cuentaOrigenId,
        cuentaDestinoId,
        monto,
        descripcion = ""
    }) {
        // validar monto
        const montoNumerico = Number(monto);

        if (
            !Number.isFinite(montoNumerico) ||
            montoNumerico <= 0
        ) {
            throw new Error(
                "Monto inválido, el monto debe ser mayor a cero."
            );
        }

        // Buscar cuentas
        const origen = this.buscarCuentaPorId(cuentaOrigenId);
        const destino = this.buscarCuentaPorId(cuentaDestinoId);

        if (!origen) {
            throw new Error("La cuenta origen no existe.");
        }

        if (!destino) {
            throw new Error("La cuenta destino no existe.");
        }

        // validar cuentas activas
        if (!origen.activa) {
            throw new Error("La cuenta origen no está activa.");
        }

        if (!destino.activa) {
            throw new Error("La cuenta destino no está activa.");
        }

        // evitar transferencia a la misma cuenta
        if (origen.id === destino.id) {
            throw new Error(
                "No puedes transferir dinero a la misma cuenta."
            );
        }

        // validar saldo suficiente
        if (origen.saldo < montoNumerico) {
            throw new Error("Saldo insuficiente.");
        }

        // Actualizar saldos
        origen.retirar(montoNumerico);
        destino.depositar(montoNumerico);

        // Movimiento enviado
        const movimientoEnviado = new Movimiento({
            tipo: "TRANSFERENCIA_ENVIADA",
            monto: montoNumerico,
            descripcion,
            cuentaOrigen: origen.id,
            cuentaDestino: destino.id,
            saldoResultante: origen.saldo
        });

        // Movimiento recibido
        const movimientoRecibido = new Movimiento({
            tipo: "TRANSFERENCIA_RECIBIDA",
            monto: montoNumerico,
            descripcion,
            cuentaOrigen: origen.id,
            cuentaDestino: destino.id,
            saldoResultante: destino.saldo
        });

        // Registrar ambos movimientos
        this.registrarMovimiento(movimientoEnviado);
        this.registrarMovimiento(movimientoRecibido);

        return {
            origen,
            destino,
            movimientoEnviado,
            movimientoRecibido
        };
    }

    // obtener movimientos de una cuenta
    obtenerMovimientosDeCuenta(cuentaId) {
        return this.movimientos.filter(
            (movimiento) =>
                movimiento.cuentaOrigen === cuentaId ||
                movimiento.cuentaDestino === cuentaId
        );
    }
}
