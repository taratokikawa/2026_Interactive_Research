import React from 'react';

const toLocalInputValue = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

type Props = {
  value: Date;
  onChange: (date: Date) => void;
};

export default function DateTimeField({ value, onChange }: Props) {
  return (
    <>
      <style>{`
        .datetime-field::-webkit-calendar-picker-indicator {
          transform: scale(1.5);
          cursor: pointer;
        }
      `}</style>
      <input
        type="datetime-local"
        className="datetime-field"
        value={toLocalInputValue(value)}
        onChange={(e) => {
          if (e.target.value) onChange(new Date(e.target.value));
        }}
        style={{
          border: 'none',
          borderRadius: 8,
          padding: 20,
          fontSize: 25,
          color: '#8a7f79',
          fontFamily: 'Arial',
        }}
      />
    </>
  );
}