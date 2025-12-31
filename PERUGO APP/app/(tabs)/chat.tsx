// app/(tabs)/chat.tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	Pressable,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import * as Speech from 'expo-speech';
import { useChat } from '../../src/context/ChatContext';
import { useUiTheme } from '../../src/context/UiThemeContext';

export default function ChatTabScreen() {
	const { messages, loading, sendTextMessage, lastAssistantText } = useChat();
	const [input, setInput] = useState('');
	const [isPlaying, setIsPlaying] = useState(false);
	const { theme } = useUiTheme();
	const isDark = theme === 'dark';

	const screenBackground = isDark ? '#020617' : '#f3f4f6';
	const assistantBubbleBackground = isDark ? '#1f2933' : '#e5e7eb';
	const assistantTextColor = isDark ? '#e5e7eb' : '#0f172a';
	const userBubbleBackground = '#0f766e';
	const userTextColor = '#ffffff';
	const inputRowBackground = isDark ? '#020617' : '#ffffff';
	const inputBorderColor = isDark ? '#334155' : '#d1d5db';
	const inputBackground = isDark ? '#020617' : '#f9fafb';
	const inputTextColor = isDark ? '#f9fafb' : '#0f172a';
	const inputPlaceholderColor = isDark ? '#9ca3af' : '#9ca3af';

	const assistantMessages = useMemo(
		() => messages.filter((m) => m.sender === 'assistant' && m.text !== 'Escribiendo…'),
		[messages],
	);

	const handleSend = useCallback(async () => {
		const value = input.trim();
		if (!value || loading) return;
		setInput('');
		await sendTextMessage(value);
	}, [input, loading, sendTextMessage]);

	const playLastAssistant = useCallback(async () => {
		if (!lastAssistantText) return;

		if (isPlaying) {
			Speech.stop();
			setIsPlaying(false);
			return;
		}

		setIsPlaying(true);
		Speech.speak(lastAssistantText, {
			language: 'es-PE',
			onDone: () => setIsPlaying(false),
			onError: () => setIsPlaying(false),
		});
	}, [isPlaying, lastAssistantText]);

	return (
		<View style={[styles.container, { backgroundColor: screenBackground }] }>
			<Header />
			<KeyboardAvoidingView
				style={styles.flex}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
			>
				<View style={styles.chatHeader}>
					<Text style={styles.chatTitle}>PeruGo Asistente</Text>
					<Text style={styles.chatStatus}>En línea</Text>
				</View>
				<ScrollView contentContainerStyle={styles.messagesContainer}>
					{messages.map((m) => {
						const isUser = m.sender === 'user';
						return (
							<View
								key={m.id}
								style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowAssistant]}
							>
								<View
									style={[
										styles.bubble,
										isUser
											? [styles.bubbleUser, { backgroundColor: userBubbleBackground }]
											: [styles.bubbleAssistant, { backgroundColor: assistantBubbleBackground }],
									]}
								>
									<Text
										style={
											isUser
												? [styles.textUser, { color: userTextColor }]
												: [styles.textAssistant, { color: assistantTextColor }]
										}
									>
										{m.text}
									</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>

				<View
					style={[
						styles.inputRow,
						{ backgroundColor: inputRowBackground, borderTopColor: isDark ? '#1e293b' : '#e5e7eb' },
					]}
				>
					<TextInput
						style={[styles.input, { borderColor: inputBorderColor, backgroundColor: inputBackground, color: inputTextColor }]}
						placeholder="Escribe tu pregunta o mensaje..."
						placeholderTextColor={inputPlaceholderColor}
						value={input}
						onChangeText={setInput}
						onSubmitEditing={handleSend}
						returnKeyType="send"
					/>
					<Pressable style={styles.sendButton} onPress={playLastAssistant}>
						<Feather
							name={isPlaying ? 'volume-x' : 'volume-2'}
							size={20}
							color="#ffffff"
						/>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	flex: {
		flex: 1,
	},
	chatHeader: {
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#0f766e',
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		marginHorizontal: 12,
		marginTop: 8,
		marginBottom: 4,
	},
	chatTitle: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
	},
	chatStatus: {
		color: '#bbf7d0',
		fontSize: 12,
		marginTop: 2,
	},
	messagesContainer: {
		padding: 16,
		paddingBottom: 12,
	},
	messageRow: {
		marginBottom: 8,
		flexDirection: 'row',
	},
	messageRowUser: {
		justifyContent: 'flex-end',
	},
	messageRowAssistant: {
		justifyContent: 'flex-start',
	},
	bubble: {
		maxWidth: '80%',
		borderRadius: 16,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	bubbleUser: {
		backgroundColor: '#0f766e',
	},
	bubbleAssistant: {
		backgroundColor: '#e5e7eb',
	},
	textUser: {
		color: '#ffffff',
		fontSize: 14,
	},
	textAssistant: {
		color: '#0f172a',
		fontSize: 14,
	},
	inputRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
		backgroundColor: '#ffffff',
	},
	input: {
		flex: 1,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: '#d1d5db',
		paddingHorizontal: 14,
		paddingVertical: 8,
		marginRight: 8,
		backgroundColor: '#f9fafb',
		fontSize: 14,
	},
	sendButton: {
		backgroundColor: '#0f766e',
		borderRadius: 999,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	sendButtonText: {
		color: '#ffffff',
		fontWeight: '600',
		fontSize: 14,
	},
});
