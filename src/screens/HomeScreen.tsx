import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Button,
    TextInput,
} from 'react-native';
import SettingsModal from '../components/SettingsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightTheme, darkTheme } from '../utils/theme';

const HomeScreen = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [ipAddress, setIpAddress] = useState('');
    const [wakeWord, setWakeWord] = useState('');
    const [verbose, setVerbose] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const scrollViewRef = useRef<ScrollView>(null);

    const theme = darkMode ? darkTheme : lightTheme;

    useEffect(() => {
        // Load settings from AsyncStorage
        const loadSettings = async () => {
            const savedIp = await AsyncStorage.getItem('llmIpAddress');
            const savedWakeWord = await AsyncStorage.getItem('wakeWord');
            const savedVerbose = await AsyncStorage.getItem('verbose');
            if (savedIp) setIpAddress(savedIp);
            if (savedWakeWord) setWakeWord(savedWakeWord);
            if (savedVerbose) setVerbose(savedVerbose === 'true');
        };
        loadSettings();
    }, []);

    useEffect(() => {
        // Ping backend if IP is present
        const pingServer = async () => {
            if (!ipAddress) {
                setServerStatus('offline');
                return;
            }
            setServerStatus('checking');
            try {
                // Use /api/tags for a lightweight ping, or /api/generate with a dummy prompt
                const response = await fetch(`http://${ipAddress}:11434/api/tags`);
                if (response.ok) {
                    setServerStatus('online');
                } else {
                    setServerStatus('offline');
                }
            } catch {
                setServerStatus('offline');
            }
        };
        pingServer();
    }, [ipAddress]);

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
                    model: 'qwen3:4b',
                    prompt: message,
                    stream: verbose,
                }),
            });
            const text = await response.text();
            // Split by newlines and parse each JSON object
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
        wakeWord,
        verbose,
        darkMode,
    }: {
        ipAddress: string;
        wakeWord: string;
        verbose: boolean;
        darkMode: boolean;
    }) => {
        setSettingsVisible(false);
        setIpAddress(ipAddress);
        setWakeWord(wakeWord);
        setVerbose(verbose);
        setDarkMode(darkMode);
        await AsyncStorage.setItem('llmIpAddress', ipAddress);
        await AsyncStorage.setItem('wakeWord', wakeWord);
        await AsyncStorage.setItem('verbose', verbose ? 'true' : 'false');
        await AsyncStorage.setItem('darkMode', darkMode ? 'true' : 'false');
        addLog('Settings saved.');
    };

    const handleDeleteLogs = () => {
        setLogs([]);
        addLog('Logs deleted.');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Top Bar */}
                <View
                    style={[
                        styles.topBar,
                        { backgroundColor: theme.card, borderBottomColor: theme.border },
                    ]}
                >
                    <Text style={[styles.title, { color: theme.text }]}>My-LLM</Text>
                    <TouchableOpacity style={styles.hamburger} onPress={handleOpenSettings}>
                        <Ionicons name="menu" size={28} color={theme.text} />
                    </TouchableOpacity>
                </View>
                {/* Settings Modal */}
                <SettingsModal
                    visible={settingsVisible}
                    onCancel={() => setSettingsVisible(false)}
                    onSave={handleSaveSettings}
                    onDeleteLogs={handleDeleteLogs}
                    initialIpAddress={ipAddress}
                    initialWakeWord={wakeWord}
                    initialVerbose={verbose}
                    initialDarkMode={darkMode}
                    theme={theme}
                />
                {/* Logs */}
                <View style={[styles.logContainer, { backgroundColor: theme.card }]}>
                    <ScrollView ref={scrollViewRef} style={styles.logScroll}>
                        {logs.map((log, idx) => (
                            <Text
                                key={idx}
                                style={[styles.logText, { color: theme.logText }]}
                                selectable
                            >
                                {log}
                            </Text>
                        ))}
                    </ScrollView>
                    {/* Send Message Feature */}
                    <View style={styles.sendRow}>
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
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: theme.button }]}
                            onPress={handleSendMessage}
                        >
                            <Ionicons name="send" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Server Status */}
                <View
                    style={[
                        styles.bottomBar,
                        { backgroundColor: theme.card, borderTopColor: theme.border },
                    ]}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color:
                                serverStatus === 'online'
                                    ? 'green'
                                    : serverStatus === 'offline'
                                    ? 'red'
                                    : 'orange',
                            textAlign: 'center',
                        }}
                    >
                        {serverStatus === 'checking'
                            ? 'Checking server...'
                            : serverStatus === 'online'
                            ? 'Server Online'
                            : 'Server Offline'}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F0F0' },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    hamburger: { padding: 4 },
    desc: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        margin: 20,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
    },
    logContainer: {
        flex: 1,
        margin: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
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
        color: '#444',
        marginBottom: 4,
    },
    sendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    sendInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#f9f9f9',
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#6200EE',
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBar: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
});

export default HomeScreen;
