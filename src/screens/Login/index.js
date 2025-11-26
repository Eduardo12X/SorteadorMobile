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

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            if (Platform.OS === 'web') {
                window.alert('Erro: Preencha todos os campos');
            } else {
                Alert.alert('Erro', 'Preencha todos os campos');
            }
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (!result.success) {
            if (Platform.OS === 'web') {
                window.alert('Erro: Email ou senha incorretos');
            } else {
                Alert.alert('Erro', 'Email ou senha incorretos');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sorteador de Números</Text>
            <Text style={styles.subtitle}>Login</Text>

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

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#F2F2EB" />
                ) : (
                    <Text style={styles.buttonText}>Entrar</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.linkText}>
                    Não tem conta? <Text style={styles.linkTextBold}>Cadastre-se</Text>
                </Text>
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
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F2F2EB',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
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
    linkButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#888',
        fontSize: 16,
    },
    linkTextBold: {
        color: '#3772FF',
        fontWeight: 'bold',
    },
});