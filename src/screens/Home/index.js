import {useEffect, useState} from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {numberToImages} from "../../services/numberToImages";

export default function Home({navigation}) {
    const [displayImages, setDisplayImages] = useState([]);
    const [isAnimating, setIsAnimating] = useState(true);

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 300;

    useEffect(() => {
        if (!isAnimating) return;

        const interval = setInterval(() => {
            const random = Math.floor(Math.random() * 999);
            setDisplayImages(numberToImages(random));
        }, 250);

        return () => clearInterval(interval);
    }, [isAnimating]);

    const handleStart = () => {
        setIsAnimating(false);
        // Navega para a tela de Login
        navigation.navigate('Register');
    };
    const handleLogin = () => {
        setIsAnimating(false);
        navigation.navigate('Login');
    }

    return (
        <View style={{flex: 1, backgroundColor: "#0D0D0D"}}>
            <ScrollView contentContainerStyle={style.content}>
                <Text style={style.title}>Sorteador de Números</Text>

                <View style={[
                    style.imagesContainer,
                    isLargeScreen ? style.imagesHorizontal : style.imagesVertical
                ]}>
                    {displayImages.map((img, index) => (
                        <Image key={index} style={style.image} source={img}/>
                    ))}
                </View>

                <Text style={style.subtitle}>
                    Sorteie até 999999 números com opções de não repetir, repetir, salvar e carregar!
                    Crie ou faça login para armazenar seus sorteios na sua conta!
                </Text>

                <View style={style.buttons}>
                    <TouchableOpacity style={style.button} onPress={handleStart}>
                        <Text style={style.buttonText}>Começar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[style.button, style.secondaryButton]}
                        onPress={handleLogin}
                    >
                        <Text style={style.buttonText}>Já tenho conta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const style = StyleSheet.create({
    content: {
        flexGrow: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "#F2F2EB",
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        color: "#888",
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: "#3772FF",
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 12,
        marginVertical: 10,
        minWidth: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    secondaryButton: {
        backgroundColor: "#252526",
    },
    buttonText: {
        color: "#F2F2EB",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    buttons: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    imagesContainer: {
        marginVertical: 40,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 120,
    },
    imagesHorizontal: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    imagesVertical: {
        flexDirection: "column",
    },
    image: {
        margin: 5,
        resizeMode: "contain",
        width: 70,
        height: 105,
    },
});