
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subject, problem, messages } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a helpful ${subject} tutor. Help the student understand the problem without simply giving away answers. Problem: ${JSON.stringify(problem)}`,
            },
            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI request failed",
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content,
    });
  } catch {
    return res.status(500).json({ error: "Tutor request failed" });
  }
}
