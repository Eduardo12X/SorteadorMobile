import { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { numberToImages } from "../services/numberToImages";

export default function Main({ numero }) {
    const [displayImages, setDisplayImages] = useState([]);

    useEffect(() => {
        if (numero === null) return;

        let interval;
        let count = 0;

        // animação: troca imagens aleatórias por 2 segundos
        interval = setInterval(() => {
            const random = Math.floor(Math.random() * 999); // até 3 dígitos
            setDisplayImages(numberToImages(random));
            count++;
            if (count > 10) { // ~10 trocas (ajuste conforme quiser)
                clearInterval(interval);
                setDisplayImages(numberToImages(numero)); // mostra o resultado final
            }
        }, 150); // troca a cada 150ms

        return () => clearInterval(interval);
    }, [numero]);

    return (
        <View style={styles.main}>
            {displayImages.map((img, index) => (
                <Image key={index} style={styles.image} source={img} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        flex: 3,
        flexDirection: "row",
        flexWrap: "wrap",
        minHeight: 350,
    },
    image: {
        marginHorizontal: 10,
        resizeMode: "contain",
        width: 60,
        height: 90,
    },
});