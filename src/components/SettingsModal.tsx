import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme, darkTheme } from '../utils/theme';

const SettingsModal = ({
    visible,
    onCancel,
    onSave,
    onDeleteLogs,
    initialIpAddress = '',
    initialModelName = '',
    initialVerbose = false,
    initialDarkMode = false,
    theme,
}: {
    visible: boolean;
    onCancel: () => void;
    onSave: (settings: {
        ipAddress: string;
        modelName: string;
        verbose: boolean;
        darkMode: boolean;
    }) => void;
    onDeleteLogs: () => void;
    initialIpAddress?: string;
    initialModelName?: string;
    initialVerbose?: boolean;
    initialDarkMode?: boolean;
    theme: any;
}) => {
    const [ipAddress, setIpAddress] = useState(initialIpAddress);
    const [modelName, setModelName] = useState(initialModelName);
    const [verbose, setVerbose] = useState(initialVerbose);
    const [localDarkMode, setLocalDarkMode] = useState(initialDarkMode);

    const insets = useSafeAreaInsets();

    useEffect(() => {
        setIpAddress(initialIpAddress);
    }, [initialIpAddress, visible]);

    useEffect(() => {
        setModelName(initialModelName);
    }, [initialModelName, visible]);

    useEffect(() => {
        setVerbose(initialVerbose);
    }, [initialVerbose, visible]);

    useEffect(() => {
        setLocalDarkMode(initialDarkMode);
    }, [initialDarkMode, visible]);

    const modalTheme = localDarkMode ? darkTheme : lightTheme;
    const styles = stylesCreate(modalTheme);

    return (
        <Modal visible={visible} transparent animationType="slide" statusBarTranslucent>
            <View style={{ flex: 1 }}>
                {/* Overlay covers the whole screen, including safe area */}
                <View
                    style={{
                        flex: 1,
                        backgroundColor: theme.safeViewBackground,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={[
                            styles.modal,
                            {
                                backgroundColor: modalTheme.background,
                                paddingBottom: insets.bottom,
                            },
                        ]}
                    >
                        <Text style={[styles.header, { color: modalTheme.text }]}>Settings</Text>
                        <Text style={[styles.label, { color: modalTheme.text }]}>
                            LLM IP Address
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
                        <Text style={[styles.label, { color: modalTheme.text }]}>Model Name</Text>
                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: modalTheme.inputBackground,
                                    color: modalTheme.inputText,
                                    borderColor: modalTheme.border,
                                },
                            ]}
                            value={modelName}
                            onChangeText={setModelName}
                            placeholder="Enter model name"
                            placeholderTextColor={modalTheme.inputText}
                            autoCapitalize="none"
                        />
                        <View style={styles.togglesColumn}>
                            <View style={styles.toggleRow}>
                                <Text style={[styles.label, { color: modalTheme.text }]}>
                                    Verbose
                                </Text>
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
                                </View>
                                <Switch
                                    value={localDarkMode}
                                    onValueChange={setLocalDarkMode}
                                    thumbColor={localDarkMode ? '#222' : '#eee'}
                                />
                            </View>
                            <View style={styles.deleteRow}>
                                <Text style={[styles.label, { color: modalTheme.text }]}>
                                    Delete Logs
                                </Text>
                                <TouchableOpacity onPress={onDeleteLogs}>
                                    <Text style={{ color: '#d9534f' }}>DELETE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.fullButton, { marginRight: 8 }]}
                                    onPress={onCancel}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.fullButton}
                                    onPress={() =>
                                        onSave({
                                            ipAddress,
                                            modelName,
                                            verbose,
                                            darkMode: localDarkMode,
                                        })
                                    }
                                >
                                    <Text style={styles.buttonText}>Save Settings</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <TouchableOpacity
                                style={styles.githubButton}
                                onPress={() =>
                                    Linking.openURL('https://github.com/WoodAlanM/My-LLM/issues')
                                }
                            >
                                <Ionicons
                                    name="logo-github"
                                    size={22}
                                    color="#fff"
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={styles.githubText}>
                                    Feature Requests / Bug Reports
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.coffeeButton}
                                onPress={() =>
                                    Linking.openURL('https://buymeacoffee.com/woodalanmc')
                                }
                            >
                                <Text style={styles.coffeeText}>☕ Buy Me a Coffee</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const stylesCreate = (modalTheme: any) =>
    StyleSheet.create({
        modal: {
            width: '92%',
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 20,
            elevation: 5,
            alignItems: 'stretch',
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
        fullButton: {
            flex: 1,
            backgroundColor: '#007bff',
            paddingVertical: 12,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        buttonRow: {
            width: '100%',
            paddingTop: 8,
            paddingBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        deleteRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 8,
            marginBottom: 4,
        },
        card: {
            width: '100%',
            backgroundColor: modalTheme.inputBackground,
            borderRadius: 10,
            padding: 12,
            marginTop: 12,
            marginBottom: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
        },
        githubButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: '#24292e',
            paddingVertical: 12,
            borderRadius: 6,
            marginBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        githubText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        coffeeButton: {
            width: '100%',
            backgroundColor: '#FFDD00',
            paddingVertical: 12,
            borderRadius: 6,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        coffeeText: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 16,
        },
        togglesColumn: {
            flexDirection: 'column',
            marginTop: 12,
            marginBottom: 4,
            gap: 8,
        },
        toggleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
    });

export default SettingsModal;
