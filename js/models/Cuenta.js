// 2-cuenta
//cuenta bank del usuario 
import { generarId } from "../utils/auxiliares.js";

export class Cuenta {

    constructor({
        id = generarId(),
        numeroCuenta,
        tipo = "Ahorro",
        saldo = 0,
        usuarioId,
        fechaApertura = new Date().toISOString(),
        activa = true
    }) {

        this.id = id;
        this.numeroCuenta = numeroCuenta;
        this.tipo = tipo;
        this.saldo = Number(saldo);
        this.usuarioId = usuarioId;
        this.fechaApertura = fechaApertura;
        this.activa = activa;
    }

    // Agregar $ a la cuenta
    depositar(monto) {
        this.saldo += Number(monto);
        return this.saldo;
    }

    // Restar $ de la cuenta del usuario
    retirar(monto) {
        this.saldo -= Number(monto);
        return this.saldo;
    }
}