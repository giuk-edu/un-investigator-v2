// /api/claude.js
// Vercel Serverless Function - Claude API 호출 백엔드
// API 키는 Vercel 환경변수에 안전하게 보관됩니다.

export default async function handler(req, res) {
  // CORS 설정 (같은 도메인이면 사실 불필요하지만 안전 차원)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages 필드가 필요합니다." });
    }

    if (!system || typeof system !== "string") {
      return res.status(400).json({ error: "system 필드가 필요합니다." });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.");
      return res.status(500).json({
        error: "서버 설정 오류입니다. 교사에게 문의하세요. (API 키 미설정)",
      });
    }

    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: system,
        messages: messages,
      }),
    });

    if (!claudeResponse.ok) {
      const errorBody = await claudeResponse.text();
      console.error("Claude API 오류:", claudeResponse.status, errorBody);
      return res.status(claudeResponse.status).json({
        error: `Claude API 호출 실패 (${claudeResponse.status}). 잠시 후 다시 시도해주세요.`,
      });
    }

    const data = await claudeResponse.json();

    const textContent = data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    if (!textContent) {
      return res.status(500).json({
        error: "응답 형식 오류입니다. 다시 시도해주세요.",
      });
    }

    return res.status(200).json({
      reply: textContent,
      usage: data.usage || null,
    });
  } catch (error) {
    console.error("백엔드 처리 오류:", error);
    return res.status(500).json({
      error: "서버 처리 오류입니다. 잠시 후 다시 시도해주세요.",
    });
  }
}
