
## Versión actual v0.4.0 
Modelo  del banco y reglas del dominio bancario lo que si y lo que no.

## Funciones agregadas
En esta versión se creó Banco.js en models dentro de js, para administrar
usuarios, cuentas y movimientos.

Se utilizaron los métodos agregarUsuario(),
buscarUsuarioPorId(), agregarCuenta(),
buscarCuentaPorId(), buscarCuentaPorNumero(),
obtenerCuentasDeUsuario(), registrarMovimiento(),
realizarDeposito() y obtenerMovimientosDeCuenta().

También se agregaron validaciones para evitar
cuentas duplicadas y depósitos con montos inválidos.
