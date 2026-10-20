// Función para generar identificadores únicos

export function generarId() {
    return `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
}
