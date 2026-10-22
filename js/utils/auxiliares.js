// Función para generar identificadores únicos

export function generarId() {
    return `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
}


// genra un num de cuenta de 12 digitos
export function generarNumeroCuenta() {
    let numeroCuenta = "";

    for (let i = 0; i < 12; i += 1) {
        numeroCuenta += Math.floor(Math.random() * 10);
    }

    return numeroCuenta;
}
