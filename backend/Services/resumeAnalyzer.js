import { model } from "./geminiService.js";

const generateWithRetry = async (prompt) => {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await Promise.race([
  model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Gemini timeout")), 30000)
  ),
]);

      const text = result.response.text();

      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");

      const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);

      try {
  return JSON.parse(jsonString);
} catch (parseError) {
  console.log("PARSE ERROR:");
  console.log(parseError);

  console.log("FAILED JSON:");
  console.log(jsonString);

  throw new Error("Gemini returned invalid JSON");
}
    } catch (err) {
      lastError = err;

      if (err.message.includes("503") || err.message.includes("high demand")) {
        console.log(`Retry ${attempt}...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        continue;
      }

      throw err;
    }
  }

  throw lastError;
};

export const analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `
You are an ATS (Applicant Tracking System).

Analyze the resume against the job description.

Calculate the score based on:

- Technical skills match (50%)
- Relevant projects (20%)
- Experience (15%)
- Education (10%)
- Missing required skills (5%)

Return ONLY valid JSON.

Rules:
1. Give a match score between 0 and 100.
2. Focus on technical skills, tools, frameworks, education, and experience.
3. Ignore phone numbers, email addresses, and formatting.
4. Return ONLY valid JSON.

Response format:

{
  "score": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "strengths": [],
  "suggestions": []
}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

  return generateWithRetry(prompt);
};

export const interviewQuestionsGenerator = async (
  resumeText,
  jobDescription,
) => {
  const prompt = `
You are a technical interviewer.

Generate:

- Exactly 5 technical questions
- Exactly 3 behavioral questions
- Exactly 2 project questions

Return ONLY valid JSON.

Do not include explanations.
Do not include markdown.
Do not include code blocks.
Do not include any text before or after the JSON.

{
  "technicalQuestions": [
    "",
    "",
    "",
    "",
    ""
  ],
  "behavioralQuestions": [
    "",
    "",
    ""
  ],
  "projectQuestions": [
    "",
    ""
  ]
}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

  return generateWithRetry(prompt);
};
