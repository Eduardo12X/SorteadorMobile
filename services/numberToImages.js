export function numberToImages(numero) {
    const str = numero.toString().padStart(3, "0"); // mínimo 3 dígitos
    return str.split("").map((digit) => {
        if (digit == 0) {
            return require(`../assets/numbers/N0.png`)
        }
        if (digit == 1) {
            return require(`../assets/numbers/N1.png`)
        }
        if (digit == 2) {
            return require(`../assets/numbers/N2.png`)
        }
        if (digit == 3) {
            return require(`../assets/numbers/N3.png`)
        }
        if (digit == 4) {
            return require(`../assets/numbers/N4.png`)
        }
        if (digit == 5) {
            return require(`../assets/numbers/N5.png`)
        }
        if (digit == 6) {
            return require(`../assets/numbers/N6.png`)
        }
        if (digit == 7) {
            return require(`../assets/numbers/N7.png`)
        }
        if (digit == 8) {
            return require(`../assets/numbers/N8.png`)
        }
        if (digit == 9) {
            return require(`../assets/numbers/N9.png`)
        }
    });
}