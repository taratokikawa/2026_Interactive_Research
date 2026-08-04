import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const MAX_CHARS = 500;

export default function Feedback() {
  const router = useRouter();
  const [effectiveness, setEffectiveness] = useState<number | null>(null);
  const [usability, setUsability] = useState<number | null>(null);
  const [style, setStyle] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const renderRatingRow = (
    title: string,
    subtitle: string,
    value: number | null,
    setValue: (n: number) => void
    ) => (
    <View style={styles.ratingBlock}>
        <Text style={styles.ratingTitle}>{title}</Text>
        <Text style={styles.ratingSubtitle}>{subtitle}</Text>
        <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.ratingButton, value === num && styles.ratingButtonSelected]}
            onPress={() => setValue(num)}
          >
            <Text
            style={[
                styles.ratingButtonText,
                value === num && styles.ratingButtonTextSelected,
            ]}
            >
            {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleSubmit = async () => {
    setError('');

    if (!effectiveness || !usability || !style) {
      setError('Please provide a rating for all three categories.');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setError('You must be logged in to submit feedback.');
      return;
    }

    const { error: insertError } = await supabase.from('feedback').insert({
      effectiveness_rating: effectiveness,
      usability_rating: usability,
      style_rating: style,
      comments: comments.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thank You!</Text>
        <Text style={styles.thankYouText}>Your form has been succesfully submitted. We appreciate your feedback!</Text>
        <TouchableOpacity style={styles.submitButton} onPress={() => router.replace('/PracticeHub')}>
          <Text style={styles.buttonText}>Return to Hub</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feedback</Text>

      <View style={styles.mainRow}>
        <View style={styles.ratingsColumn}>
            {renderRatingRow('Effectiveness', 'How much did the interactive help you as a learner?', effectiveness, setEffectiveness)}
            {renderRatingRow('User Friendliness', 'How easy was the interactive to use and navigate?', usability, setUsability)}
            {renderRatingRow('Style', 'How would you rate the aesthetics and interface design?', style, setStyle)}
        </View>

        <View style={styles.responseColumn}>
            <Text style={styles.ratingLabel}>Comments</Text>
            <Text style={styles.ratingSubtitle}>What did you like and dislike the most about the interactive and why?</Text>
            <Text style={styles.ratingSubtitle}>Be specific in your response and include ideas for improvement!</Text>

            <TextInput
            style={styles.textArea}
            multiline
            maxLength={MAX_CHARS}
            value={comments}
            onChangeText={setComments}
            placeholder="Share your thoughts..."
            />
            <Text style={styles.charCount}>
            {comments.length} / {MAX_CHARS}
            </Text>
        </View>
        </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFE787',
    paddingHorizontal: 75,
    paddingVertical: 20,
    alignItems: 'center',
    },
  title: {
    fontSize: 80,
    color: 'white',
    marginVertical: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  thankYouText: {
    fontSize: 36,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  mainRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 75,
},
  ratingsColumn: {
    flex: 0.5,
    paddingRight: 15,
  },
  responseColumn: {
    flex: 0.5,
    paddingLeft: 15,
  },
  ratingBlock: {
    width: '100%',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ratingButtonSelected: {
    backgroundColor: '#A7C7E7',
  },
  ratingButtonText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#4d3b2c',
  },
  ratingButtonTextSelected: {
    color: 'white',
  },
  textArea: {
    width: '100%',
    minHeight: 500,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    textAlignVertical: 'top',
    fontSize: 32,
    color: '#4d3b2c',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: 'white',
    marginTop: 4,
    marginBottom: 10,
    fontSize: 28,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 32,
  },
  submitButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 32,
  },
  ratingTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
},
    ratingSubtitle: {
    fontSize: 24,
    color: '#8a7f79',
    marginBottom: 20,
},
});