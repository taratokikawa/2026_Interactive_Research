
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { subject, problem, messages } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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

    return Response.json({
      reply:
        completion.choices[0]?.message?.content ??
        'Sorry, I had trouble responding.',
    });
  } catch {
    return Response.json(
      { error: 'Tutor request failed' },
      { status: 500 }
    );
  }
}
