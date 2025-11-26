export function numberToImages(numero) {
    const numberImages = {
        '0': require('../assets/numbers/N0.png'),
        '1': require('../assets/numbers/N1.png'),
        '2': require('../assets/numbers/N2.png'),
        '3': require('../assets/numbers/N3.png'),
        '4': require('../assets/numbers/N4.png'),
        '5': require('../assets/numbers/N5.png'),
        '6': require('../assets/numbers/N6.png'),
        '7': require('../assets/numbers/N7.png'),
        '8': require('../assets/numbers/N8.png'),
        '9': require('../assets/numbers/N9.png'),
    };

    const str = numero.toString();
    const paddedStr = str.length <= 3 ? str.padStart(3, "0") : str;

    return paddedStr.split("").map(digit => numberImages[digit]);
}