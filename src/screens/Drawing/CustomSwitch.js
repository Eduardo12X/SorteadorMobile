import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';

export default function CustomSwitch({ value, onValueChange, disabled = false }) {
    const [animation] = React.useState(new Animated.Value(value ? 1 : 0));

    React.useEffect(() => {
        Animated.timing(animation, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 42], // Ajuste conforme o tamanho
    });

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#E0E0E0', '#28a745'], // Cinza para ON verde
    });

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            disabled={disabled}
        >
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <Text style={[
                    styles.label,
                    { opacity: value ? 0 : 1, left: 12 }
                ]}>
                    OFF
                </Text>
                <Text style={[
                    styles.label,
                    { opacity: value ? 1 : 0, right: 12 }
                ]}>
                    ON
                </Text>
                <Animated.View
                    style={[
                        styles.circle,
                        { transform: [{ translateX }] }
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 40,
        borderRadius: 10,
        padding: 2,
        justifyContent: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    circle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        position: 'absolute',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});