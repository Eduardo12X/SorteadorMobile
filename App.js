import { useState } from "react";
import {ScrollView, StyleSheet, View} from "react-native";

import Header from "./body/header";
import Main from "./body/main";
import Footer from "./body/footer";

import { sortearNumero } from "./services/randomNumbers";

export default function App() {
  const [numero, setNumero] = useState(null);
  const [historico, setHistorico] = useState([]);

  function handleSortear(min, max) {
    try {
      const sorteado = sortearNumero(min, max);
      setNumero(sorteado);
      setHistorico((prev) => [...prev, sorteado]); // adiciona ao histórico
    } catch (e) {
      console.warn(e.message);
    }
  }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Header />
            <View style={styles.content}>
                <Main numero={numero} />
            </View>
                <Footer onSortear={handleSortear} historico={historico} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D0D0D",
    },
    content: {
        flex: 1, // ocupa o espaço do meio
        justifyContent: "center",
        alignItems: "center",
    },
});
