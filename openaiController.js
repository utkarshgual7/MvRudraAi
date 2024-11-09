
import axios from "axios";
const openaiApiKey = process.env.OPENAI_API_KEY;

export const askOpenAI = async (req, res) => {
  const { question, context } = req.body;

  try {
    const prompt = generatePrompt(question, context);
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt,
        max_tokens: 350,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    // Extract and send the response back
    const answer = response.data.choices[0].text.trim();
    res.json({ answer });
  } catch (error) {
    console.error("Error fetching answer from OpenAI:", error);
    res.status(500).json({ error: "Failed to fetch answer from OpenAI" });
  }
};


function generatePrompt(question, context) {
  const conversationHistory = context
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
  return `${conversationHistory}\n\nUser: ${question}\nBot:`;
}

export default { askOpenAI };
