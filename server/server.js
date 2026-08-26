import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import * as pdf from "pdf-parse";
import fs from "fs";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const upload = multer({
    dest: "uploads/"
});

// ==========================
// Gemini Helper (Retry Logic)
// ==========================

async function generateWithRetry(prompt, retries = 3) {

    for (let i = 0; i < retries; i++) {

        try {

            const model = genAI.getGenerativeModel({

                model: "gemini-2.5-flash"

            });

            const result = await model.generateContent(prompt);

            return result.response.text();

        }

        catch (error) {

            console.log(`Retry ${i + 1}:`, error.message);

            if (i === retries - 1) throw error;

            await new Promise(resolve => setTimeout(resolve, 2000));

        }

    }

}

// ==========================
// Generate Interview Questions
// ==========================

app.post("/generate-questions", async (req, res) => {

    try {

        const {
            category,
            difficulty,
            experience,
            questionCount
        } = req.body;
        const prompt = `
You are an interview expert.

Generate exactly ${questionCount} ${category} interview questions.

Candidate Details:

- Qualification: BCA Student
- Experience: ${experience}
- Difficulty: ${difficulty}

Rules:

- Generate exactly ${questionCount} questions.
- Number them from 1 to ${questionCount}.
- Only questions.
- No answers.
- No explanation.
- Keep questions according to the selected difficulty and experience level.
`;

        const text = await generateWithRetry(prompt);

        res.json({

            questions: text

        });

    }

    catch (error) {

        console.log("Question Error:", error);

        if (error.status === 503) {

            return res.status(503).json({

                error: "Gemini AI is busy. Please try again after a few seconds."

            });

        }

        res.status(500).json({

            error: "Unable to generate questions."

        });

    }

});

// ==========================
// Generate AI Feedback
// ==========================

app.post("/generate-feedback", async (req, res) => {

    try {

        const { answers } = req.body;

        const prompt = `
You are an AI Interview Evaluator.

Evaluate the following interview answers.

${JSON.stringify(answers)}

Give response in this format:

Overall Performance:

Score out of 10:

Strengths:

Weaknesses:

Suggestions:

Motivate the student in 2 lines.

Keep everything simple.
`;

        const feedback = await generateWithRetry(prompt);

        res.json({

            feedback

        });

    }

    catch (error) {

        console.log("Feedback Error:", error);

        if (error.status === 503) {

            return res.status(503).json({

                error: "Gemini AI is busy. Please try again."

            });

        }

        res.status(500).json({

            error: "Unable to generate feedback."

        });

    }

});
app.post(
    "/analyze-resume",
    upload.single("resume"),
    async (req, res) => {

        try {

            const dataBuffer = fs.readFileSync(req.file.path);

            const pdfData = await pdf(dataBuffer);

            fs.unlinkSync(req.file.path);

            const model = genAI.getGenerativeModel({

                model: "gemini-2.5-flash"

            });

            const prompt = `

You are a professional Resume Reviewer.

Analyze this resume.

Resume:

${pdfData.text}

Give the result in this format:

⭐ ATS Score (out of 100)

✅ Strengths

❌ Weaknesses

💡 Improvement Tips

🚀 Final Suggestion

Keep it simple for a BCA student.

`;

            const result = await model.generateContent(prompt);

            const text = result.response.text();

            res.json({

                result: text

            });

        }

        catch (error) {

            console.log(error);

            res.status(500).json({

                result: "Resume analysis failed."

            });

        }

    }
);

// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});