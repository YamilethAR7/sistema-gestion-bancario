## Versión actual 9 - Operaciones bancarias y transferencias.

## Funcionalidades agregadas
En esta versión se agrego la página de transferencias, donde podemos realizar depósitos y enviar dinero entre cuentas registradas

2.Tambien se agregaron validaciones para evitar transferencias con saldo insuficiente, montos incorrectos o hacia la misma cuenta.

Cada transferencia genera dos movimientos: uno enviado y otro recibido y los saldos y movimientos se guardan mediante LocalStorage*

## Archivos agregados 3
- transferencia.html* página para realizar operaciones bancarias
- transferenciasUI.js* controla los formularios de depósitos y transferencias
- transferencia.css* contiene los estilos de esta página 

También se actualizaron * Banco.js y BancoService.js* para realizar las operaciones bancarias