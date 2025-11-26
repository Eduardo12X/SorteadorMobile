import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { useAuth } from '../../contexts/authContext';
import { getUserDraws, deleteDraw } from '../../services/database';

export default function DrawsList({ navigation }) {
    const [draws, setDraws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { currentUser, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadDraws();
        });
        return unsubscribe;
    }, [navigation]);

    const loadDraws = async () => {
        setLoading(true);
        const result = await getUserDraws(currentUser.id);
        if (result.success) {
            setDraws(result.draws);
        }
        setLoading(false);
        setRefreshing(false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        loadDraws();
    };

    const handleDeleteDraw = (drawId, drawName) => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm(`Deseja realmente excluir "${drawName}"?`);
            if (confirm) {
                performDelete(drawId);
            }
        } else {
            Alert.alert(
                'Confirmar Exclusão',
                `Deseja realmente excluir "${drawName}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Excluir',
                        style: 'destructive',
                        onPress: () => performDelete(drawId)
                    }
                ]
            );
        }
    };

    const performDelete = async (drawId) => {
        const result = await deleteDraw(drawId);
        if (result.success) {
            if (Platform.OS === 'web') {
                window.alert('Sucesso: Sorteio excluído!');
            } else {
                Alert.alert('Sucesso', 'Sorteio excluído!');
            }
            loadDraws();
        } else {
            if (Platform.OS === 'web') {
                window.alert('Erro: Falha ao excluir sorteio');
            } else {
                Alert.alert('Erro', 'Falha ao excluir sorteio');
            }
        }
    };

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const confirm = window.confirm('Deseja realmente sair?');
            if (confirm) {
                await logout();
            }
        } else {
            Alert.alert(
                'Confirmar Logout',
                'Deseja realmente sair?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Sair',
                        style: 'destructive',
                        onPress: async () => {
                            await logout();
                            // Não navegar manualmente: AppNavigator troca os stacks
                        }
                    }
                ]
            );
        }
    };

    const renderDrawItem = ({ item }) => (
        <View style={styles.drawCard}>
            <TouchableOpacity
                style={styles.drawCardContent}
                onPress={() => navigation.navigate('Drawing', {
                    drawId: item.id,
                    drawData: item
                })}
            >
                <Text style={styles.drawName}>{item.name}</Text>
                <Text style={styles.drawInfo}>
                    Intervalo: {item.min} - {item.max}
                </Text>
                <Text style={styles.drawInfo}>
                    Sorteados: {item.historic?.length || 0}
                </Text>
                <Text style={styles.drawDate}>
                    {new Date(item.updatedAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(item.updatedAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDraw(item.id, item.name)}
            >
                <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3772FF" />
                <Text style={styles.loadingText}>Carregando sorteios...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Meus Sorteios</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Sair</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.welcomeText}>
                Olá, {currentUser?.name || 'Usuário'}!
            </Text>

            {draws.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        Nenhum sorteio criado ainda
                    </Text>
                    <Text style={styles.emptySubtext}>
                        Crie seu primeiro sorteio!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={draws}
                    renderItem={renderDrawItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('Drawing', {
                    drawId: null,
                    drawData: null
                })}
            >
                <Text style={styles.createButtonText}>+ Criar Novo Sorteio</Text>
            </TouchableOpacity>
        </View>
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F2F2EB',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 6,
    },
    logoutButtonText: {
        color: '#F2F2EB',
        fontSize: 14,
        fontWeight: '600',
    },
    welcomeText: {
        fontSize: 16,
        color: '#888',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    list: {
        padding: 20,
        paddingTop: 10,
    },
    drawCard: {
        backgroundColor: '#252526',
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#3772FF',
        overflow: 'hidden',
    },
    drawCardContent: {
        padding: 15,
    },
    drawName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F2F2EB',
        marginBottom: 8,
    },
    drawInfo: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    drawDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        backgroundColor: '#dc3545',
        borderRadius: 6,
    },
    deleteButtonText: {
        fontSize: 18,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
    createButton: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: '#3772FF',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    createButtonText: {
        color: '#F2F2EB',
        fontSize: 18,
        fontWeight: 'bold',
    },
});