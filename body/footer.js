import { useState } from "react";
import {StyleSheet, View, TextInput, Button, Text, ScrollView} from "react-native";

export default function Footer({ onSortear, historico}) {
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");

    return (
        <ScrollView contentContainerStyle={styles.footer}
                    keyboardShouldPersistTaps="handled">
            <Text style={styles.gap}>Intervalo</Text>
            <View style={styles.inputs}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Mínimo"
                    value={min}
                    onChangeText={setMin}
                />
                <Text style={styles.interval}>-</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Máximo"
                    value={max}
                    onChangeText={setMax}
                />
            </View>

            {/* Caixa de texto com números sorteados */}
            <Text style={styles.resultTitle}>Números sorteados:</Text>
            <View style={styles.resultBox}>
                <ScrollView horizontal>
                    <Text style={styles.resultText}>
                        {historico.join(", ")}
                    </Text>
                </ScrollView>
            </View>
            <Button title="Sortear" onPress={() => onSortear(min, max)} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 350,
    },
    button: {
        marginVertical: 25,
        color: "#F2F2EB",
    },
    inputs: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 8,
        marginHorizontal: 5,
        marginVertical: 5,
        width: 80,
        textAlign: "center",
        backgroundColor: "#252526",
        borderLeftColor: "#252526",
        borderRightColor: "#252526",
        borderBottomColor: "#252526",
        borderTopColor: "#252526",
        color: "#F2F2EB",
    },
    interval: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 15,
        color: "#F2F2EB",
    },
    gap: {
        alignItems: "center",
        height: "auto",
        marginVertical: 15,
        color: "#F2F2EB",
    },
    resultBox: {
        marginVertical: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: "#252526",
        borderRadius: 6,
        height: "25%",
        width: "90%",
        minHeight: 50,
        backgroundColor: "#252526",
    },
    resultTitle: {
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        marginBottom: 5,
        color: "#F2F2EB",
    },
    resultText: {
        color: "#F2F2EB",
        fontSize: 16,
    },

});