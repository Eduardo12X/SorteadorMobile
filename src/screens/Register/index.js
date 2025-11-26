import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator, Platform,
} from 'react-native';
import { useAuth } from '../../contexts/authContext';

export default function Register({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            if (Platform.OS === 'web') {
                window.alert('Erro: Preencha todos os campos');
            } else {
                Alert.alert('Erro', 'Preencha todos os campos');
            }
            return;
        }

        if (password !== confirmPassword) {
            if (Platform.OS === 'web') {
                window.alert('Erro: As senhas não coincidem');
            } else {
                Alert.alert('Erro', 'As senhas não coincidem');
            }
            return;
        }

        if (password.length < 6) {
            if (Platform.OS === 'web') {
                window.alert('Erro: A senha deve ter pelo menos 6 caracteres');
            } else {
                Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            }
            return;
        }

        setLoading(true);
        const result = await signup(email, password, name);
        setLoading(false);

        if (result.success) {
            if (Platform.OS === 'web') {
                window.alert('Sucesso: Conta criada com sucesso!');
            } else {
                Alert.alert('Sucesso', 'Conta criada com sucesso!');
            }
        } else {
            if (Platform.OS === 'web') {
                window.alert('Erro: Falha ao criar conta - ' + (result.error || ''));
            } else {
                Alert.alert('Erro', result.error || 'Falha ao criar conta');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Criar Conta</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#888"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#F2F2EB" />
                ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 1,
    },
    backButtonText: {
        color: '#F2F2EB',
        fontSize: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F2F2EB',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#252526',
        borderWidth: 2,
        borderColor: '#3772FF',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        color: '#F2F2EB',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3772FF',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#F2F2EB',
        fontSize: 18,
        fontWeight: 'bold',
    },
});