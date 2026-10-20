
// 3-movi
// operaciones realizadas en una cuenta(+,-,*,/)

import { generarId } from "../utils/auxiliares.js";

export class Movimiento {

    constructor({
        id = generarId(),
        tipo,
        monto,
        descripcion = "",
        cuentaOrigen = null,
        cuentaDestino = null,
        saldoResultante = null,
        fecha = new Date().toISOString()
    }) {

        this.id = id;
        this.tipo = tipo;
        this.monto = Number(monto);
        this.descripcion = descripcion;
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
        this.saldoResultante = saldoResultante;
        this.fecha = fecha;
    }
}
