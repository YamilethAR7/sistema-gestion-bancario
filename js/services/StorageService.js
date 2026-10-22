// version v0.5.0
// Servicio para guardar información en LocalStorage*

// Claves que utilizaremos para almacenar datos
export const STORAGE_KEYS = {
    USUARIOS: "usuarios",
    CUENTAS: "cuentas",
    MOVIMIENTOS: "movimientos",
    SESION: "sesion"
};

// Clase para administrar LocalStorage
class StorageService {

    // Guardar info
    guardar(clave, valor) {
        const valorJSON = JSON.stringify(valor);

        localStorage.setItem(clave, valorJSON);
    }

    // Recuperar info
    obtener(clave, valorPorDefecto = null) {
        const valor = localStorage.getItem(clave);

        if (valor === null) {
            return valorPorDefecto;
        }

        try {
            return JSON.parse(valor);

        } catch (error) {
            console.error(
                `No fue posible leer la clave "${clave}" de LocalStorage.`,
                error
            );

            return valorPorDefecto;
        }
    }

    // Eliminar info de una clave
    eliminar(clave) {
        localStorage.removeItem(clave);
    }

    // Limpiar toda la info del sitio
    limpiar() {
        localStorage.clear();
    }
}

// Crear instancia del servicio
export const storageService = new StorageService();
