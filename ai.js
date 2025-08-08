import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function splitMessage(text, maxLength = 2000) {
    const chunks = [];
    let startIndex = 0;
    while (startIndex < text.length) {
        chunks.push(text.slice(startIndex, startIndex + maxLength));
        startIndex += maxLength;
    }
    return chunks;
}

async function geminiRequest(prompt) {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    if (!res.ok) {
        throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}

export async function getAIResponse(text) {
    const aiText = await geminiRequest(`You are a high IQ chatting bot. Answer this:\n\n${text}`);
    return splitMessage(aiText); 
}

export async function summarize(text) {
    if (text.length > 5000) {
        const chunks = text.match(/.{1,4000}/gs);
        const summaries = [];
        for (let chunk of chunks) {
            summaries.push(await geminiRequest(`Summarize this web content:\n\n${chunk}`));
        }
        const finalSummary = await geminiRequest(`Summarize these summaries:\n\n${summaries.join("\n")}`);
        return splitMessage(finalSummary); 
    } else {
        const summary = await geminiRequest(`Summarize this web content:\n\n${text}`);
        return splitMessage(summary); 
    }
}