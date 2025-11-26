import {useEffect, useState} from "react";
import {
    StyleSheet,
    TextInput,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    useWindowDimensions,
    Switch,
    Alert,
    Modal,
    Platform,
} from "react-native";

import {numberToImages} from "../../services/numberToImages";
import {drawNumber} from "../../services/randomNumbers";
import {getUserDraws, deleteDraw, updateDraw, createDraw} from '../../services/database';
import {useAuth} from "../../contexts/authContext";
import DrawsList from "../DrawsList";

export default function Drawing({navigation, route}) {
    const { currentUser } = useAuth();
    const { drawId, drawData } = route.params || {};

    const [displayImages, setDisplayImages] = useState([]);
    const [min, setMin] = useState(drawData?.min?.toString() || "");
    const [max, setMax] = useState(drawData?.max?.toString() || "");
    const [number, setNumber] = useState(null);
    const [historic, setHistoric] = useState(drawData?.historic || []);
    const [allowRepetition, setAllowRepetition] = useState(
        drawData?.allowRepetition !== undefined ? drawData.allowRepetition : true
    );
    const [availableNumbers, setAvailableNumbers] = useState(drawData?.availableNumbers || []);
    const [drawName, setDrawName] = useState(drawData?.name || "");
    const [showNameModal, setShowNameModal] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const { width } = useWindowDimensions();
    const isLargeScreen = width > 300;
    const isLargeScreenForButtons = width > 650;

    // Animação dos números quando sorteia
    useEffect(() => {
        if (number === null) return;

        let interval;
        let count = 0;

        const numDigits = number.toString().length;
        const maxForAnimation = Math.pow(10, Math.max(numDigits, 3)) - 1;

        interval = setInterval(() => {
            const random = Math.floor(Math.random() * (maxForAnimation + 1));
            setDisplayImages(numberToImages(random));
            count++;
            if (count > 10) {
                clearInterval(interval);
                setDisplayImages(numberToImages(number));
            }
        }, 150);

        return () => clearInterval(interval);
    }, [number]);

    // Reseta os números disponíveis quando mudar o intervalo
    useEffect(() => {
        if (!allowRepetition && min && max) {
            setAvailableNumbers([]);
        }
    }, [min, max, allowRepetition]);

    // Marca como tendo mudanças não salvas
    useEffect(() => {
        if (drawId) {
            setHasUnsavedChanges(true);
        }
    }, [historic, min, max, allowRepetition]);

    const toggleSwitch = () => {
        setAllowRepetition(previousState => !previousState);
        if (allowRepetition) {
            setHistoric([]);
            setAvailableNumbers([]);
        }
    };

    const handleSave = async () => {
        if (!min || !max) {
            if (Platform.OS === 'web') {
                window.alert('Erro: Configure o intervalo antes de salvar');
            }
            else {
                Alert.alert('Erro', 'Configure o intervalo antes de salvar');
            }
            return;
        }

        if (!drawName) {
            setShowNameModal(true);
            return;
        }

        const data = {
            name: drawName,
            min: parseInt(min),
            max: parseInt(max),
            historic,
            allowRepetition,
            availableNumbers,
        };

        let result;
        if (drawId) {
            // Atualiza sorteio existente
            result = await updateDraw(drawId, data);
        } else {
            // Cria novo sorteio
            result = await createDraw(currentUser.id, data);
        }

        if (result.success) {
            if (Platform.OS === 'web') {
                window.alert('Sucesso: Sorteio salvo!');
            }
            else {
                Alert.alert('Sucesso', 'Sorteio salvo!');
            }
            setHasUnsavedChanges(false);
        } else {
            if (Platform.OS === 'web') {
                window.alert('Erro: Falha ao salvar sorteio');
            }
            else {
                Alert.alert('Erro', 'Falha ao salvar sorteio');
            }
        }
    };

    function handleDrawing(min, max) {
        try {
            const minNum = parseInt(min);
            const maxNum = parseInt(max);

            if (isNaN(minNum) || isNaN(maxNum)) {
                if (Platform.OS === 'web') {
                    window.alert('Erro: Por favor, digite números válidos');
                } else {
                    Alert.alert('Erro', 'Por favor, digite números válidos');
                }
                return;
            }

            if (minNum >= maxNum) {
                if (Platform.OS === 'web') {
                    window.alert('Erro: O mínimo deve ser menor que o máximo');
                } else {
                    Alert.alert('Erro', 'O mínimo deve ser menor que o máximo');
                }
                return;
            }

            if (minNum < 0 || maxNum > 999999) {
                if (Platform.OS === 'web') {
                    window.alert('Erro: Intervalo máximo suportado: 1 - 999999');
                } else {
                    Alert.alert('Erro', 'Intervalo máximo suportado: 1 - 999999');
                }
                return;
            }

            if (!allowRepetition) {
                const currentAvailable = availableNumbers.length > 0
                    ? availableNumbers
                    : (() => {
                        const numbers = [];
                        for (let i = minNum; i <= maxNum; i++) {
                            if (!historic.includes(i)) {
                                numbers.push(i);
                            }
                        }
                        return numbers;
                    })();

                if (currentAvailable.length === 0) {
                    if (Platform.OS === 'web') {
                        window.alert('Atenção: Todos os números do intervalo já foram sorteados!');
                    } else {
                        Alert.alert('Atenção', 'Todos os números do intervalo já foram sorteados!');
                    }
                    return;
                }

                const randomIndex = Math.floor(Math.random() * currentAvailable.length);
                const sorteado = currentAvailable[randomIndex];

                const newAvailable = currentAvailable.filter(n => n !== sorteado);
                setAvailableNumbers(newAvailable);

                setNumber(sorteado);
                setHistoric((prev) => [...prev, sorteado]);
            } else {
                const sorteado = drawNumber(minNum, maxNum);
                setNumber(sorteado);
                setHistoric((prev) => [...prev, sorteado]);
            }
        } catch (e) {
            console.warn(e.message);
            if (Platform.OS === 'web') {
                window.alert('Erro: Erro ao sortear número');
            } else {
                Alert.alert('Erro', 'Erro ao sortear número');
            }
        }
    }

    const confirmSaveName = () => {
        if (!drawName.trim()) {
            if (Platform.OS === 'web') {
                window.alert('Erro: Digite um nome para o sorteio');
            } else {
                Alert.alert('Erro', 'Digite um nome para o sorteio');
            }
            return;
        }
        setShowNameModal(false);
        handleSave();
    };

    const clearHistory = () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm('Deseja realmente limpar todo o histórico?');
            if (confirm) {
                setHistoric([]);
                setAvailableNumbers([]);
                setNumber(null);
                setDisplayImages([]);
            }
        } else {
            Alert.alert(
                'Confirmar',
                'Deseja realmente limpar todo o histórico?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Limpar',
                        style: 'destructive',
                        onPress: () => {
                            setHistoric([]);
                            setAvailableNumbers([]);
                            setNumber(null);
                            setDisplayImages([]);
                        }
                    }
                ]
            );
        }
    };

    const handleBack = () => {
        if (hasUnsavedChanges) {
            if (Platform.OS === 'web') {
                const confirm = window.confirm('Você tem mudanças não salvas. Deseja salvar antes de sair?');
                if (confirm) {
                    handleSave().then(() => navigation.goBack());
                } else {
                    const confirmLeave = window.confirm('Tem certeza que deseja sair sem salvar?');
                    if (confirmLeave) {
                        navigation.goBack();
                    }
                }
            } else {
                Alert.alert(
                    'Mudanças não salvas',
                    'Você tem mudanças não salvas. Deseja salvar antes de sair?',
                    [
                        {
                            text: 'Sair sem salvar',
                            style: 'destructive',
                            onPress: () => navigation.goBack()
                        },
                        {
                            text: 'Salvar',
                            onPress: async () => {
                                await handleSave();
                                navigation.goBack();
                            }
                        },
                        { text: 'Cancelar', style: 'cancel' }
                    ]
                );
            }
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: "#0D0D0D"}}>
            <ScrollView
                contentContainerStyle={style.content}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity
                    style={style.backButton}
                    onPress={handleBack}
                >
                    <Text style={style.buttonText}>Voltar</Text>
                </TouchableOpacity>

                <Text style={style.title}>
                    {drawData ? drawData.name : 'Novo Sorteio'}
                </Text>

                <View style={[
                    style.imagesContainer,
                    isLargeScreen ? style.imagesHorizontal : style.imagesVertical
                ]}>
                    {displayImages.length > 0 ? (
                        displayImages.map((img, index) => (
                            <Image key={index} style={style.image} source={img} />
                        ))
                    ) : (
                        <Text style={style.placeholderText}>Digite intervalos de até 1-999999</Text>
                    )}
                </View>

                <Text style={style.gap}>Intervalo</Text>
                <View style={[style.inputs, isLargeScreen ? style.inputsHorizontal : style.inputsVertical]}>
                    <TextInput
                        style={style.input}
                        keyboardType="numeric"
                        placeholder="Mínimo"
                        placeholderTextColor="#888"
                        value={min}
                        onChangeText={setMin}
                    />
                    <Text style={style.interval}>-</Text>
                    <TextInput
                        style={style.input}
                        keyboardType="numeric"
                        placeholder="Máximo"
                        placeholderTextColor="#888"
                        value={max}
                        onChangeText={setMax}
                    />
                </View>

                <View style={style.toggleArea}>
                    <Text style={style.toggleText}>Permitir Repetição</Text>
                    <Switch
                        onValueChange={toggleSwitch}
                        value={allowRepetition}
                        trackColor={{ false: "#767577", true: "#228B22" }}
                        thumbColor={allowRepetition ? "#155915" : "#f4f3f4"}
                    />
                </View>

                {!allowRepetition && (
                    <Text style={style.infoText}>
                        Números restantes: {
                        availableNumbers.length > 0
                            ? availableNumbers.length
                            : (max && min ? (parseInt(max) - parseInt(min) + 1 - historic.length) : 0)
                    }
                    </Text>
                )}

                <Text style={style.resultTitle}>Números sorteados:</Text>
                <ScrollView style={style.resultBox} nestedScrollEnabled={true}>
                    <Text style={style.resultText}>
                        {historic.length > 0 ? historic.join(", ") : "Nenhum número sorteado ainda"}
                    </Text>
                </ScrollView>

                <View style={[style.buttons, isLargeScreenForButtons ?
                    style.buttonsHorizontal : style.buttonsVertical]}>

                    <TouchableOpacity
                        onPress={() => handleDrawing(min, max)}
                        style={style.button}
                    >
                        <Text style={style.buttonText}>Sortear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        style={[style.button, {backgroundColor: "#28a745"}]}
                    >
                        <Text style={style.buttonText}>💾 Salvar</Text>
                    </TouchableOpacity>

                    {historic.length > 0 && (
                        <TouchableOpacity
                            onPress={clearHistory}
                            style={[style.button, {backgroundColor: "#dc3545"}]}
                        >
                            <Text style={style.buttonText}>Limpar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{height: 50}} />
            </ScrollView>

            {/* Modal para nome do sorteio */}
            <Modal
                visible={showNameModal}
                transparent
                animationType="fade"
            >
                <View style={style.modalOverlay}>
                    <View style={style.modalContent}>
                        <Text style={style.modalTitle}>Nome do Sorteio</Text>
                        <TextInput
                            style={style.modalInput}
                            placeholder="Ex: Sorteio da Rifa"
                            placeholderTextColor="#888"
                            value={drawName}
                            onChangeText={setDrawName}
                        />
                        <View style={style.modalButtons}>
                            <TouchableOpacity
                                style={[style.modalButton, {backgroundColor: "#666"}]}
                                onPress={() => setShowNameModal(false)}
                            >
                                <Text style={style.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[style.modalButton, {backgroundColor: "#3772FF"}]}
                                onPress={confirmSaveName}
                            >
                                <Text style={style.buttonText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const style = StyleSheet.create({
    backButton: {
        alignSelf: "center",
        padding: 10,
        marginBottom: 10,
        width: "100%",
        backgroundColor: "#595959",
        borderRadius: 5,
    },
    content: {
        flexGrow: 1,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
    },
    title: {
        marginTop: 30,
        marginBottom: 20,
        fontSize: 24,
        fontWeight: "bold",
        color: "#F2F2EB",
        textAlign: "center",
    },
    imagesContainer: {
        marginVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 100,
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
        width: 60,
        height: 90,
    },
    placeholderText: {
        color: "#8C8C8C",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 20,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#252526",
        borderRadius: 8,
        marginHorizontal: 5,
        marginVertical: 8,
        paddingVertical: 15,
        paddingHorizontal: 30,
        minWidth: 150,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: "#F2F2EB",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: 25,
    },
    buttonsHorizontal: {
        flexDirection: "row",
    },
    buttonsVertical: {
        flexDirection: "column",
    },
    inputs: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        marginTop: 10,
    },
    inputsHorizontal: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    inputsVertical: {
        flexDirection: "column",
    },
    input: {
        borderWidth: 2,
        borderColor: "#3772FF",
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 8,
        marginVertical: 5,
        width: 100,
        textAlign: "center",
        backgroundColor: "#252526",
        color: "#F2F2EB",
        fontSize: 16,
    },
    interval: {
        marginHorizontal: 15,
        color: "#F2F2EB",
        fontSize: 24,
        fontWeight: "bold",
    },
    gap: {
        marginVertical: 15,
        color: "#F2F2EB",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    toggleArea: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15,
        gap: 10,
    },
    toggleText: {
        color: "#F2F2EB",
        fontSize: 16,
        marginVertical: 10,
    },
    infoText: {
        color: "#8C8C8C",
        fontSize: 14,
        marginVertical: 15,
        fontWeight: "600",
    },
    resultBox: {
        marginHorizontal: 15,
        marginVertical: 15,
        padding: 15,
        borderWidth: 2,
        borderColor: "#F2F2EB",
        borderRadius: 8,
        width: "90%",
        maxWidth: 500,
        minHeight: 60,
        maxHeight: 200,
        backgroundColor: "#252526",
    },
    resultTitle: {
        textAlign: "center",
        marginTop: 10,
        marginBottom: 5,
        color: "#F2F2EB",
        fontSize: 16,
        fontWeight: "600",
    },
    resultText: {
        color: "#F2F2EB",
        fontSize: 16,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#252526',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        borderWidth: 2,
        borderColor: '#3772FF',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F2F2EB',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: '#0D0D0D',
        borderWidth: 2,
        borderColor: '#3772FF',
        borderRadius: 8,
        padding: 12,
        color: '#F2F2EB',
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});