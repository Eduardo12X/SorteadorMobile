import {StyleSheet, View, Text} from "react-native";

export default function Header() {
    return (
        <View style={styles.header}>
            <Text style={styles.text}>Sorteador</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        marginTop: 50,
        fontSize: 18,
        fontWeight: "bold",
        color: "#F2F2EB",
    }
})