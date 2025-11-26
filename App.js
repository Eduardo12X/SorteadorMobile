import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { AuthProvider } from './src/contexts/authContext';
import Navigation from './src/routes/navigation';
import { initDatabase } from './src/services/database';

export default function App() {
    const [dbInitialized, setDbInitialized] = useState(false);

    useEffect(() => {
        initDatabase()
            .then(() => {
                console.log('Banco de dados inicializado!');
                setDbInitialized(true);
            })
            .catch((error) => {
                console.error('Erro ao inicializar banco:', error);
            });
    }, []);

    if (!dbInitialized) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3772FF" />
                <Text style={styles.loadingText}>Inicializando...</Text>
            </View>
        );
    }

    return (
        <AuthProvider>
            <View style={styles.container}>
                <Navigation />
            </View>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#F2F2EB',
        marginTop: 10,
        fontSize: 16,
    },
});