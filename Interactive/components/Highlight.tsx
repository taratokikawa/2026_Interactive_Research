import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, StyleProp, Image } from 'react-native';


export type HighlightColor = 'yellow' | 'blue' | 'pink';

export const HIGHLIGHT_COLOR_MAP: Record<HighlightColor, string> = {
  yellow: '#fff8b9',
  blue: '#90CAF9',
  pink: '#F8BBD0',
};

type HighlightAction = {
  wordIndex: number;
  previousColor: HighlightColor | null;
};

export function useHighlights(resetKey: string) {
  const [showTools, setShowTools] = useState(false);
  const [activeColor, setActiveColor] = useState<HighlightColor | null>(null);
  const [highlights, setHighlights] = useState<Record<number, HighlightColor>>({});
  const [history, setHistory] = useState<HighlightAction[]>([]);

  useEffect(() => {
    setHighlights({});
    setHistory([]);
    setActiveColor(null);
    setShowTools(false);
  }, [resetKey]);

  const handleWordPress = (index: number) => {
    if (!activeColor) return;
    const previousColor = highlights[index] ?? null;
    if (previousColor === activeColor) return;

    setHistory((prev) => [...prev, { wordIndex: index, previousColor }]);
    setHighlights((prev) => ({ ...prev, [index]: activeColor }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];

    setHighlights((prev) => {
      const next = { ...prev };
      if (last.previousColor) {
        next[last.wordIndex] = last.previousColor;
      } else {
        delete next[last.wordIndex];
      }
      return next;
    });
    setHistory((prev) => prev.slice(0, -1));
  };

  return {
    showTools,
    toggleShowTools: () => setShowTools((prev) => !prev),
    activeColor,
    setActiveColor,
    highlights,
    handleWordPress,
    handleUndo,
    canUndo: history.length > 0,
  };
}

type HighlightedTextProps = {
  text: string;
  highlights: Record<number, HighlightColor>;
  onWordPress: (index: number) => void;
  style?: StyleProp<TextStyle>;
};

export function HighlightedText({ text, highlights, onWordPress, style }: HighlightedTextProps) {
  const tokens = text.split(/(\s+)/);

  return (
    <Text style={style}>
      {tokens.map((token, index) => {
        if (token.trim() === '') {
          return <Text key={index}>{token}</Text>;
        }
        const color = highlights[index];
        return (
          <Text
            key={index}
            onPress={() => onWordPress(index)}
            style={color ? { backgroundColor: HIGHLIGHT_COLOR_MAP[color] } : undefined}
          >
            {token}
          </Text>
        );
      })}
    </Text>
  );
}

type AnnotateControlsProps = {
  showTools: boolean;
  toggleShowTools: () => void;
  activeColor: HighlightColor | null;
  setActiveColor: (c: HighlightColor) => void;
  onUndo: () => void;
  canUndo: boolean;
};

export function AnnotateControls({
  showTools,
  toggleShowTools,
  activeColor,
  setActiveColor,
  onUndo,
  canUndo,
}: AnnotateControlsProps) {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.annotateButton} onPress={toggleShowTools}>
        <Image
          source={require('../assets/marker.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {showTools && (
        <>
          {(Object.keys(HIGHLIGHT_COLOR_MAP) as HighlightColor[]).map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorSwatch,
                { backgroundColor: HIGHLIGHT_COLOR_MAP[color] },
                activeColor === color && styles.colorSwatchActive,
              ]}
              onPress={() => setActiveColor(color)}
            />
          ))}

          <TouchableOpacity
            style={[styles.undoButton, !canUndo && styles.undoButtonDisabled]}
            onPress={onUndo}
            disabled={!canUndo}
          >
            <Text style={styles.undoButtonText}>Undo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  annotateButton: {
    backgroundColor: '#8a7f79',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 50,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
  },
  undoButtonText: {
    color: '#4d3b2c',
    fontSize: 30,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSwatchActive: {
    borderColor: '#fff',
  },
  undoButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  undoButtonDisabled: {
    opacity: 0.5,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});