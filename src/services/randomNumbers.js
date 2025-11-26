export function drawNumber(min, max) {
    const n1 = parseInt(min);
    const n2 = parseInt(max);

    /* if (isNaN(n1) || isNaN(n2) || n1 > n2) {
        throw new Error("Intervalo inválido");
    } */

    return Math.floor(Math.random() * (n2 - n1 + 1)) + n1;
}