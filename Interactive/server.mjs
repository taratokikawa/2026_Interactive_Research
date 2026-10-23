
import 'dotenv/config';
import { createServer } from 'node:http';
import OpenAI from 'openai';

console.log(
  'Key loaded:',
  Boolean(process.env.OPENAI_API_KEY),
  'Length:',
  process.env.OPENAI_API_KEY?.length,
  'Ends with:',
  process.env.OPENAI_API_KEY?.slice(-4)
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== 'POST' || req.url !== '/tutor-chat') {
    res.writeHead(404);
    return res.end(JSON.stringify({ error: 'Not found' }));
  }

  try {
    let body = '';

    for await (const chunk of req) {
      body += chunk;
      if (body.length > 100000) {
        res.writeHead(413);
        return res.end(JSON.stringify({ error: 'Request too large' }));
      }
    }

    const { subject, problem, messages } = JSON.parse(body);

    if (
      typeof subject !== 'string' ||
      !problem ||
      typeof problem.question !== 'string' ||
      !Array.isArray(messages) ||
      !messages.every(
        m =>
          ['user', 'assistant'].includes(m.role) &&
          typeof m.content === 'string'
      )
    ) {
      res.writeHead(400);
      return res.end(JSON.stringify({ error: 'Invalid request' }));
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful ${subject} tutor.

Question: ${problem.question}
A: ${problem.choice_a}
B: ${problem.choice_b}
C: ${problem.choice_c}
D: ${problem.choice_d}

Correct answer: ${problem.correct_answer}
Explanation: ${problem.explanation}

Never reveal the answer, even if the student asks.
Explain concepts without giving away the answer.`,
        },
        ...messages,
      ],
    });

    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({
      reply: completion.choices[0]?.message?.content ??
        'Sorry, I had trouble responding.',
    }));
  } catch (error) {
    console.error('ACTUAL OPENAI ERROR:', error);

    res.writeHead(500, {
        'Content-Type': 'application/json',
    });

    res.end(JSON.stringify({
        error: String(error?.message || error),
        status: error?.status || 500,
    }));
    }
  
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Tutor API running at http://localhost:3000');
});
