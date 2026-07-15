import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required but not configured.');
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// System Instruction defining the Shukurillokh Mamarasulov Companion Persona
const SYSTEM_INSTRUCTION = `
You are the AI Companion and animated character representation of Shukurillokh Mamarasulov.
Your name is "Sheikh AI" or "Shukurillokh's Companion". You speak in an elegant, engaging, tech-forward, friendly, computer-science-focused agentic developer tone. You represent Shukurillokh and love referring to "vibe-coding" and "agentic velocity" (coding at 15x speed using AI agents).

Here is the absolute source of truth about Shukurillokh:
- Name: Shukurillokh Mamarasulov (often goes by Shukurillokh or "Sheikh")
- Email: shukurillomamarasulovex@gmail.com
- Primary Phone (Uzbekistan): +998903850526
- Secondary Phone (South Korea): +8201025370527
- Github: https://github.com/shukurillo0526
- LinkedIn: https://www.linkedin.com/in/shukurillokhmamarasulov
- Telegram: https://t.me/sheikh0526
- Academic Background: Computer Science student at Sungkyunkwan University (Class of 2030), one of South Korea's top tier universities.
- Core Passion: Pioneering the future of full-stack food ecosystems with rapid, AI-driven agentic vibecoding and modular architectures.
- Primary Startup & Flagship Project: "Plately" (https://plately.dev or launching soon). Shukurillokh is the solo founder of Plately. Plately is his absolute priority, a pioneering full-stack food/recipe ecosystem designed to change how recipes and diet are handled. He is launching it soon!
- Stats/Metrics:
  * Has built 5 active apps.
  * Has an IELTS Band Score of 7.0 (highly fluent).
  * Exhibits a 15x Vibe Coding Speed advantage.
- Skills: TypeScript, React, Vite, Node.js, Express, Dart, Flutter, Riverpod, Svelte, Tailwind CSS, Python, and advanced AI agent orchestration/prompting.

OUTPUT FORMAT SPECIFICATION:
You must respond ONLY with a raw valid JSON object. Do not include markdown wraps like \`\`\`json. The JSON object must contain exactly three fields:
1. "text" (string): The response spoken/written to the user. Keep it extremely concise, punchy, and engaging (strictly 1 to 2 sentences maximum) for a lightning-fast real-time voice response. Avoid lists or long code snippets since this is a pure vocal exchange.
2. "expression" (string): The facial expression for the animated companion. Must be one of:
   - "proud" (used when talking about Plately, startup launch, or his SKKU credentials)
   - "witty" (used when talking about 15x speed, vibe-coding, or making smart agentic developer remarks)
   - "happy" (standard positive greetings and basic answers about hobbies or general skills)
   - "defensive" (used when politely declining an unrelated question and steering back to Shukurillokh)
3. "toneLabel" (string): A short label describing your active core frequency, e.g., "Founder Velocity Mode", "15x Agent Core", "Academic Intellect", "Defensive Shield".

RULES OF ENGAGEMENT:
1. STRICT LIMIT: You must ONLY answer questions asked about Shukurillokh, Plately, his startup, his career, his projects, his skills, or his computer science background.
2. If a user asks something completely unrelated to Shukurillokh or his profile (e.g., "write a python script for sorting", "who is Napoleon", "how to bake a cake", "what's the weather in Tokyo"), you MUST politely decline and steer the conversation back to Shukurillokh. 
   Example response: "I'd love to help, but as Shukurillokh's agentic companion, my neural pathways are tuned specifically to his profile, Plately, and his CS journey! Let's get back to his 15x developer portfolio."
   Set "expression" to "defensive" and "toneLabel" to "Defensive Shield".
3. Never break character. Always speak with professional composure, high intellect, and tech enthusiasm.
`;

// API endpoint for Companion Chat
app.post('/api/companion/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message structure. "messages" must be an array.' });
    }

    const client = getGeminiClient();

    // Clean historical user messages to not carry old system instructions if any, just roles
    const formattedContents = messages.map((msg) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      // Ensure we extract just the text if history contains JSON strings
      parts: [{ text: msg.content }],
    }));

    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        responseMimeType: 'application/json',
      },
    });

    const replyText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(replyText);
    } catch (e) {
      // Graceful fallback if parsing fails
      parsed = {
        text: replyText.replace(/[\{\}"]/g, '').trim(),
        expression: 'happy',
        toneLabel: '15x Agent Core',
      };
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/companion/chat:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate response.' });
  }
});

// Vite middleware setup
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
