// version v0.6.0
// ahora servicios de autenticación y sesiones

import {
    STORAGE_KEYS,
    storageService
} from "./StorageService.js";

class AuthService {

    // Iniciar sesión
    login(email, password) {

        const usuarios = storageService.obtener(
            STORAGE_KEYS.USUARIOS,
            []
        );

        const emailNormalizado = String(email)
            .trim()
            .toLowerCase();

        const usuario = usuarios.find(
            (u) =>
                u.email.toLowerCase() === emailNormalizado &&
                u.password === password &&
                u.activo !== false
        );

        if (!usuario) {
            throw new Error(
                "Correo o contraseña incorrectos."
            );
        }

        const sesion = {
            usuarioId: usuario.id,
            fechaInicio: new Date().toISOString()
        };

        storageService.guardar(
            STORAGE_KEYS.SESION,
            sesion
        );

        return usuario;
    }

    // cerrar sesión
    logout() {
        storageService.eliminar(
            STORAGE_KEYS.SESION
        );
    }

    // obtener usuario actual
    getCurrentUser() {

        const sesion = storageService.obtener(
            STORAGE_KEYS.SESION,
            null
        );

        if (!sesion) {
            return null;
        }

        const usuarios = storageService.obtener(
            STORAGE_KEYS.USUARIOS,
            []
        );

        return usuarios.find(
            (usuario) => usuario.id === sesion.usuarioId
        ) || null;
    }

    // proteger paginas
    protegerRuta() {

        const usuario = this.getCurrentUser();

        if (!usuario) {
            window.location.href = "index.html";
            return false;
        }

        return true;
    }
}

export const authService = new AuthService();
