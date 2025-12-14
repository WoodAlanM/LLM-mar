import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Image,
    Keyboard,
} from 'react-native';
import SettingsModal from '../components/SettingsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from '../utils/theme';
import ConnectionCard from '../components/ConnectionCard';

const HomeScreen = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const [modelName, setModelName] = useState('');
    const [verbose, setVerbose] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const theme = darkMode ? darkTheme : lightTheme;

    useEffect(() => {
        const loadSettings = async () => {
            const savedIp = await AsyncStorage.getItem('llmIpAddress');
            const savedModel = await AsyncStorage.getItem('modelName');
            const savedVerbose = await AsyncStorage.getItem('verbose');
            const savedDarkMode = await AsyncStorage.getItem('darkMode');
            if (savedIp) setIpAddress(savedIp);
            if (savedModel) setModelName(savedModel);
            if (savedVerbose) setVerbose(savedVerbose === 'true');
            if (savedDarkMode) setDarkMode(savedDarkMode === 'true');
        };
        loadSettings();
    }, []);

    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hide = Keyboard.addListener('keyboardDidHide', (e) => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
        });

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev, msg]);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleSendMessage = async () => {
        if (message.trim() === '') return;
        addLog('Sent: ' + message);
        if (!ipAddress) {
            addLog('No IP address set. Please configure in settings.');
            return;
        }
        try {
            const response = await fetch(`http://${ipAddress}:11434/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // model name: like qwen3:4b
                    model: modelName,
                    prompt: message,
                    stream: verbose,
                }),
            });
            const text = await response.text();
            const lines = text.split('\n').filter(Boolean);
            let finalResponse = '';
            lines.forEach((line) => {
                try {
                    const obj = JSON.parse(line);
                    if (obj.response) finalResponse += obj.response;
                } catch {}
            });
            addLog('Ollama final response: ' + finalResponse.trim());
        } catch (err) {
            addLog('Connection failed: ' + err);
        }
        setMessage('');
    };

    const handleOpenSettings = () => {
        setSettingsVisible(true);
    };

    const handleSaveSettings = async ({
        ipAddress,
        modelName,
        verbose,
        darkMode,
    }: {
        ipAddress: string;
        modelName: string;
        verbose: boolean;
        darkMode: boolean;
    }) => {
        setSettingsVisible(false);
        setIpAddress(ipAddress);
        setModelName(modelName);
        setVerbose(verbose);
        setDarkMode(darkMode);
        await AsyncStorage.setItem('llmIpAddress', ipAddress);
        await AsyncStorage.setItem('modelName', modelName);
        await AsyncStorage.setItem('verbose', verbose ? 'true' : 'false');
        await AsyncStorage.setItem('darkMode', darkMode ? 'true' : 'false');
        addLog('Settings saved.');
    };

    const insets = useSafeAreaInsets();

    const handleDeleteLogs = () => {
        setLogs([]);
        addLog('Logs deleted.');
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.safeViewBackground }}>
            {/* Top Safe Area ONLY */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: theme.safeViewBackground }}>
                <View
                    style={[
                        styles.topBar,
                        { backgroundColor: theme.card, borderBottomColor: theme.border },
                    ]}
                >
                    <View style={styles.titleRow}>
                        <Image
                            source={require('../../assets/adaptive-icon.png')}
                            style={styles.icon}
                            resizeMode="contain"
                        />
                        <Text style={[styles.title, { color: theme.text }]}>LLM-mar</Text>
                    </View>

                    <TouchableOpacity style={styles.hamburger} onPress={handleOpenSettings}>
                        <Ionicons name="menu" size={28} color={theme.text} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Keyboard-aware body */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Logs */}
                <View
                    style={[
                        styles.logContainer,
                        { backgroundColor: theme.card, borderColor: theme.border },
                    ]}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{ paddingBottom: 12 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {logs.map((log, idx) => (
                            <Text key={idx} style={[styles.logText, { color: theme.logText }]}>
                                {log}
                            </Text>
                        ))}
                    </ScrollView>
                </View>

                {/* Settings Modal */}
                <SettingsModal
                    visible={settingsVisible}
                    onCancel={() => setSettingsVisible(false)}
                    onSave={handleSaveSettings}
                    onDeleteLogs={handleDeleteLogs}
                    initialIpAddress={ipAddress}
                    initialModelName={modelName}
                    initialVerbose={verbose}
                    initialDarkMode={darkMode}
                    theme={theme}
                />

                {/* Message Input */}
                <View
                    style={[
                        styles.messageBox,
                        {
                            backgroundColor: theme.card,
                            borderTopColor: theme.border,
                            paddingBottom: keyboardVisible ? keyboardHeight + 55 : insets.bottom,
                        },
                    ]}
                >
                    <TextInput
                        style={[
                            styles.sendInput,
                            {
                                backgroundColor: theme.inputBackground,
                                color: theme.inputText,
                                borderColor: theme.border,
                            },
                        ]}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.inputText}
                        onSubmitEditing={handleSendMessage}
                        returnKeyType="send"
                        multiline
                        numberOfLines={3}
                    />

                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.button }]}
                        onPress={handleSendMessage}
                    >
                        <Ionicons name="send" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        marginRight: 8,
    },
    title: { fontSize: 20, fontWeight: 'bold' },
    hamburger: { padding: 4 },
    logContainer: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        justifyContent: 'flex-end',
    },
    logScroll: {
        flex: 1,
    },
    logText: {
        fontSize: 13,
        marginBottom: 4,
    },
    sendInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        minHeight: 40,
        maxHeight: 90,
    },
    sendButton: {
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageBoxAvoiding: {
        left: 0,
        right: 0,
        bottom: 0,
    },
    messageBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 8,
        paddingBottom: 15,
        borderTopWidth: 1,
    },
});

export default HomeScreen;
