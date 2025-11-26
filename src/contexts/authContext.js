import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, loginUser } from '../services/database';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carregar usuário salvo ao iniciar
    useEffect(() => {
        loadSavedUser();
    }, []);

    const loadSavedUser = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('currentUser');
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cadastro
    async function signup(email, password, name) {
        try {
            const result = await createUser(name, email, password);

            if (result.success) {
                // Fazer login automático após cadastro
                const loginResult = await loginUser(email, password);
                if (loginResult.success) {
                    setCurrentUser(loginResult.user);
                    await AsyncStorage.setItem('currentUser', JSON.stringify(loginResult.user));
                }
                return { success: true };
            }
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: error.error || error.message };
        }
    }

    // Login
    async function login(email, password) {
        try {
            const result = await loginUser(email, password);

            if (result.success) {
                setCurrentUser(result.user);
                await AsyncStorage.setItem('currentUser', JSON.stringify(result.user));
                return { success: true };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.error || error.message };
        }
    }

    // Logout
    async function logout() {
        try {
            setCurrentUser(null);
            await AsyncStorage.removeItem('currentUser');
            console.log('Logout: currentUser foi limpo');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}