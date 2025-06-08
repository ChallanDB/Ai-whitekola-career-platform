import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Send, Calendar, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChatStore } from '@/store/chatStore';
import ChatMessage from '@/components/ChatMessage';
import Colors from '@/constants/colors';
import { mockChatMessages } from '@/utils/mockData';
import { useSettingsStore } from '@/store/settingsStore';

export default function LearnScreen() {
  const router = useRouter();
  const { darkMode } = useSettingsStore();
  const { 
    messages, 
    addMessage, 
    clearChat, 
    isLoading, 
    setIsLoading,
    sendMessageToAI
  } = useChatStore();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Initialize with mock messages if empty
  React.useEffect(() => {
    if (messages.length === 0) {
      mockChatMessages.forEach(msg => addMessage(msg));
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Send message to AI
    await sendMessageToAI(userMessage);
    
    // Scroll to bottom again after response
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleClearChat = () => {
    clearChat();
    // Add initial message
    addMessage({
      role: 'assistant',
      content: 'Hello! I am your AI career assistant. How can I help you today with your career in Cameroon?',
    });
  };

  const handleBookCounseling = () => {
    router.push('/counseling/book');
  };

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.darkContainer]} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.headerTabs}>
          <View style={styles.activeTab}>
            <Text style={[styles.tabText, darkMode && styles.darkText]}>AI Assistant</Text>
          </View>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={handleBookCounseling}
          >
            <Text style={[styles.tabText, darkMode && styles.darkText]}>Expert Counseling</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={handleClearChat}
        >
          <Trash2 size={18} color={darkMode ? Colors.dark.text : Colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.primary} size="small" />
          <Text style={[styles.loadingText, darkMode && styles.darkText]}>AI is thinking...</Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={[styles.inputWrapper, darkMode && styles.darkInputWrapper]}>
          <TextInput
            style={[styles.input, darkMode && styles.darkText]}
            placeholder="Ask about career advice in Cameroon..."
            placeholderTextColor={darkMode ? Colors.dark.subtext : Colors.subtext}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.disabledSendButton]} 
            onPress={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <TouchableOpacity 
        style={styles.counselingButton}
        onPress={handleBookCounseling}
      >
        <Calendar size={20} color="white" />
        <Text style={styles.counselingButtonText}>Book Expert Counseling</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  darkContainer: {
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTabs: {
    flexDirection: 'row',
    flex: 1,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  darkText: {
    color: Colors.dark.text,
  },
  clearButton: {
    padding: 8,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: 'white',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  darkInputWrapper: {
    backgroundColor: Colors.dark.background,
  },
  input: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    color: Colors.text,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledSendButton: {
    opacity: 0.5,
  },
  counselingButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  counselingButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});