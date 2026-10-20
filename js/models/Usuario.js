// 1-usuario
// va la parte en donde  una persona sea registrada en el sistema bank

import { generarId } from "../utils/auxiliares.js";

export class Usuario {

    constructor({
        id = generarId(),
        nombre,
        email,
        telefono = "",
        password,
        activo = true
    }) {

        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.telefono = telefono;
        this.password = password;
        this.activo = activo;
    }
}
