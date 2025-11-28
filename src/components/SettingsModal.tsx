import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Switch,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../utils/theme';

const SettingsModal = ({
    visible,
    onCancel,
    onSave,
    onDeleteLogs,
    initialIpAddress = '',
    initialWakeWord = '',
    initialVerbose = false,
    initialDarkMode = false,
    theme,
}: {
    visible: boolean;
    onCancel: () => void;
    onSave: (settings: {
        ipAddress: string;
        wakeWord: string;
        verbose: boolean;
        darkMode: boolean;
    }) => void;
    onDeleteLogs: () => void;
    initialIpAddress?: string;
    initialWakeWord?: string;
    initialVerbose?: boolean;
    initialDarkMode?: boolean;
    theme: any;
}) => {
    const [ipAddress, setIpAddress] = useState(initialIpAddress);
    const [wakeWord, setWakeWord] = useState(initialWakeWord);
    const [verbose, setVerbose] = useState(initialVerbose);

    // Local dark mode state for instant UI update
    const [localDarkMode, setLocalDarkMode] = useState(initialDarkMode);

    useEffect(() => {
        setIpAddress(initialIpAddress);
    }, [initialIpAddress, visible]);

    useEffect(() => {
        setWakeWord(initialWakeWord);
    }, [initialWakeWord, visible]);

    useEffect(() => {
        setVerbose(initialVerbose);
    }, [initialVerbose, visible]);

    useEffect(() => {
        setLocalDarkMode(initialDarkMode);
    }, [initialDarkMode, visible]);

    // Use localDarkMode for modal theme
    const modalTheme = localDarkMode ? darkTheme : lightTheme;

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View
                style={{
                    flex: 1,
                    backgroundColor: modalTheme.background,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={[styles.modal, { backgroundColor: modalTheme.card }]}>
                    <Text style={[styles.header, { color: modalTheme.text }]}>Settings</Text>
                    <Text style={[styles.label, { color: modalTheme.text }]}>
                        LLM IP Address (Tailscale)
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: modalTheme.inputBackground,
                                color: modalTheme.inputText,
                                borderColor: modalTheme.border,
                            },
                        ]}
                        value={ipAddress}
                        onChangeText={setIpAddress}
                        placeholder="Enter IP address"
                        placeholderTextColor={modalTheme.inputText}
                        autoCapitalize="none"
                    />
                    <Text style={[styles.label, { color: modalTheme.text }]}>Wake Word</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: modalTheme.inputBackground,
                                color: modalTheme.inputText,
                                borderColor: modalTheme.border,
                            },
                        ]}
                        value={wakeWord}
                        onChangeText={setWakeWord}
                        placeholder="Enter wake word"
                        placeholderTextColor={modalTheme.inputText}
                        autoCapitalize="none"
                    />
                    <View style={styles.toggleRow}>
                        <Text style={[styles.label, { color: modalTheme.text }]}>Verbose</Text>
                        <Switch
                            value={verbose}
                            onValueChange={setVerbose}
                            thumbColor={verbose ? '#222' : '#eee'}
                        />
                    </View>
                    <View style={styles.toggleRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons
                                name={localDarkMode ? 'moon' : 'sunny'}
                                size={22}
                                color={modalTheme.text}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={{ color: modalTheme.text, marginRight: 8 }}>
                                Dark Mode
                            </Text>
                            <Switch
                                value={localDarkMode}
                                onValueChange={setLocalDarkMode}
                                thumbColor={localDarkMode ? '#222' : '#eee'}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonRow}>
                        <Button title="Delete Logs" color="#d9534f" onPress={onDeleteLogs} />
                    </View>
                    <View style={styles.buttonRow}>
                        <Button title="Cancel" onPress={onCancel} />
                        <Button
                            title="Save Settings"
                            onPress={() =>
                                onSave({
                                    ipAddress,
                                    wakeWord,
                                    verbose,
                                    darkMode: localDarkMode,
                                })
                            }
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 4,
    },
});

export default SettingsModal;
