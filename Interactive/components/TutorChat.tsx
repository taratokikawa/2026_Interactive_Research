import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

type Problem = {
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation: string;
};

type TutorChatProps = {
  problem: Problem;
  subject: string;
  onClose: () => void;
};

export default function TutorChat({
  problem,
  subject,
  onClose,
}: TutorChatProps) {
  const [chatMessages, setChatMessages] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: chatInput.trim(),
    };

    const updatedMessages = [...chatMessages, userMessage];

    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const tutorApiUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/tutor-chat'
          : '/api/tutor-chat';

      const response = await fetch(tutorApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          problem,
          messages: updatedMessages,
        }),
      });


      
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? 'Tutor request failed');
    }

    const reply =
      data.reply ?? 'Sorry, I had trouble responding.';

    setChatMessages([
      ...updatedMessages,
      {
        role: 'assistant',
        content: reply,
      },
    ]);

    } catch (err) {
      console.error('Tutor chat error:', err);

      setChatMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    }

    setChatLoading(false);
  };

  return (
    <View style={styles.chatPanel}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderText}>Ask a Question!</Text>

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.chatCloseText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.chatMessages}>
        {chatMessages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.chatBubble,
              msg.role === 'user'
                ? styles.chatBubbleUser
                : styles.chatBubbleAssistant,
            ]}
          >
            <Text style={styles.chatBubbleText}>{msg.content}</Text>
          </View>
        ))}

        {chatLoading && (
          <Text style={styles.chatLoadingText}>Thinking...</Text>
        )}
      </ScrollView>

      <View style={styles.chatInputRow}>
        <TextInput
          style={styles.chatInput}
          value={chatInput}
          onChangeText={setChatInput}
          placeholder="Type your question..."
          onSubmitEditing={handleSendChat}
        />

        <TouchableOpacity
          style={styles.chatSendButton}
          onPress={handleSendChat}
        >
          <Text style={styles.chatSendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatPanel: {
    marginTop: 20,
    flex: 0.33,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginLeft: 10,
    overflow: 'hidden',
  },

  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  chatHeaderText: {
    fontSize: 20,
    color: '#4d3b2c',
  },

  chatCloseText: {
    fontSize: 18,
    color: '#4d3b2c',
  },

  chatMessages: {
    flex: 1,
    marginBottom: 8,
  },

  chatBubble: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    maxWidth: '90%',
  },

  chatBubbleUser: {
    backgroundColor: '#A7C7E7',
    alignSelf: 'flex-end',
  },

  chatBubbleAssistant: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },

  chatBubbleText: {
    color: '#4d3b2c',
  },

  chatLoadingText: {
    color: '#8a7f79',
    fontStyle: 'italic',
  },

  chatInputRow: {
    flexDirection: 'row',
    gap: 6,
  },

  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
  },

  chatSendButton: {
    backgroundColor: '#A7C7E7',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderRadius: 6,
  },

  chatSendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
