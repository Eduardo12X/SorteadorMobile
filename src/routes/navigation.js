import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/authContext';

// Telas públicas
import Home from '../screens/Home';
import Login from '../screens/Login';
import Register from '../screens/Register';

// Telas autenticadas
import DrawsList from '../screens/DrawsList';
import Drawing from '../screens/Drawing';

const Stack = createNativeStackNavigator();

// Stack para usuários não autenticados
function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
}

// Stack para usuários autenticados
function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName="DrawsList"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="DrawsList" component={DrawsList} />
            <Stack.Screen name="Drawing" component={Drawing} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { currentUser, loading } = useAuth();

    if (loading) return null;

    return (
        <NavigationContainer key={currentUser ? 'app' : 'auth'}>
            {currentUser ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
