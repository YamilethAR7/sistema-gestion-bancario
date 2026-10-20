// Función para val
export function validarCampoObligatorio(valor){
return (
    valor !== undefined &&
        valor !== null &&
        String(valor).trim() !== ""
    );

}
export function validarMonto(monto){
const montoNumerico = Number(monto);

return (
    Number.isFinite(montoNumerico) &&
        montoNumerico > 0
    );

}