import React, { createContext, useCallback, useContext, useState } from 'react';

export type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
};

export type ChatContextValue = {
  messages: ChatMessage[];
  loading: boolean;
  sendTextMessage: (text: string) => Promise<void>;
  setExternalUserMessage: (text: string) => Promise<void>;
  // NUEVA FUNCIÓN: Agrega la conversación (Usuario + IA) directamente
  addGeneratedConversation: (userText: string, assistantText: string) => void;
  lastAssistantText: string | null;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const CHAT_API_URL = 'https://perugobackend-flask-production.up.railway.app/process';

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hola, soy tu asistente PerúGo. ¿En qué puedo ayudarte hoy?',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [lastAssistantText, setLastAssistantText] = useState<string | null>(null);

  const fetchReply = useCallback(async (text: string) => {
    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      let reply = 'No se obtuvo respuesta.';

      if (typeof data.text_response === 'object' && data.text_response !== null) {
        reply = data.text_response.reply ?? JSON.stringify(data.text_response);
      } else if (typeof data.text_response === 'string') {
        reply = data.text_response;
      }
      return String(reply);
    } catch (error) {
      return 'Error de conexión con el asistente.';
    }
  }, []);

  const coreSend = useCallback(async (text: string) => {
    const value = text.trim();
    if (!value) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + '-user', sender: 'user', text: value },
      { id: Date.now().toString() + '-typing', sender: 'assistant', text: 'Escribiendo…' },
    ]);

    setLoading(true);
    try {
      const reply = await fetchReply(value);
      setMessages((prev) => {
        const copy = [...prev];
        const idx = copy.findIndex(
          (m) => m.sender === 'assistant' && m.text === 'Escribiendo…',
        );
        if (idx >= 0) copy.splice(idx, 1);
        copy.push({
          id: Date.now().toString() + '-assistant',
          sender: 'assistant',
          text: reply,
        });
        setLastAssistantText(reply);
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }, [fetchReply]);

  const sendTextMessage = useCallback(async (text: string) => {
    await coreSend(text);
  }, [coreSend]);

  const setExternalUserMessage = useCallback(async (text: string) => {
    await coreSend(text);
  }, [coreSend]);

  // IMPLEMENTACIÓN DE LA NUEVA FUNCIÓN
  const addGeneratedConversation = useCallback((userText: string, assistantText: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + '-user', sender: 'user', text: userText },
      { id: Date.now().toString() + '-assistant', sender: 'assistant', text: assistantText },
    ]);
    setLastAssistantText(assistantText);
  }, []);

  return (
    <ChatContext.Provider
      value={{ 
        messages, 
        loading, 
        sendTextMessage, 
        setExternalUserMessage, 
        addGeneratedConversation, 
        lastAssistantText 
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat debe usarse dentro de un ChatProvider');
  }
  return ctx;
}
