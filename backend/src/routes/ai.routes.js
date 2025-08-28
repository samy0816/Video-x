import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// POST /api/ai/ask
router.post("/ask", async (req, res) => {
    const { transcript, question } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBbaJ1dlvdC2_nqRLp3o4fKDjH1MLdcbbI"; // Use GEMINI_API_KEY for backend

    // Gemini API endpoint and prompt structure
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBbaJ1dlvdC2_nqRLp3o4fKDjH1MLdcbbI`;
    const prompt = {
        contents: [
            { role: "user", parts: [
                { text: `Here is a transcript of a meeting: ${transcript}\n\nThe user asks: ${question}\n\nPlease answer based on the transcript.\n\nFormat your response as follows:\nSUMMARY: <short summary>\nPOSSIBLE QUESTIONS: <short, relevant questions a participant could ask for better clarity, one per line>` }
            ]}
        ]
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prompt)
        });
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("Gemini API raw response (not JSON):", text);
            return res.status(500).json({ error: "Gemini API did not return JSON", details: text });
        }
        // Log the full Gemini API response for debugging
        console.log("Gemini API response:", JSON.stringify(data, null, 2));
        const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer generated.";

        // Parse model output for SUMMARY and POSSIBLE QUESTIONS
        const result = { summary: "", recs: [] };
        if (modelText) {
            const summaryMatch = modelText.match(/SUMMARY:\s*([\s\S]*?)(?:\n\s*POSSIBLE QUESTIONS:|$)/i);
            if (summaryMatch) {
                result.summary = summaryMatch[1].trim().replace(/\n+/g, ' ');
            }
            const recMatch = modelText.match(/POSSIBLE QUESTIONS:\s*([\s\S]*)/i);
            if (recMatch) {
                const lines = recMatch[1]
                    .split(/\n|\r/)
                    .map(l => l.replace(/^[-\d\.\)\s]*/, '').trim())
                    .filter(Boolean)
                    .slice(0,3);
                result.recs = lines;
            }
            // Fallbacks
            if (!result.summary) {
                const para = modelText.split('\n\n')[0] || modelText.split('\n')[0];
                result.summary = (para || '').trim();
            }
            if (result.recs.length === 0) {
                const lines = modelText
                    .split(/\n|\r/)
                    .map(l => l.trim())
                    .filter(Boolean)
                    .slice(0,3);
                result.recs = lines;
            }
        }
        res.json({
            summary: result.summary,
            recommendations: result.recs,
            raw: modelText
        });
    } catch (err) {
        res.status(500).json({ error: "AI request failed", details: err.message });
    }
});

export default router;
