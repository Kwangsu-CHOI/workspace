import {
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const safetySettings = [
	{
		category: HarmCategory.HARM_CATEGORY_HARASSMENT,
		threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
	{
		category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
		threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
	},
];

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY as string);

// const model = genAI.getGenerativeModel({
// 	model: "gemini-1.5-flash",
// 	safetySettings,
// });

// export default model;

export async function POST(req: NextRequest, res: NextResponse) {
	try {
		const genAI = new GoogleGenerativeAI(
			process.env.GOOGLE_GEMINI_KEY as string
		);
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
			safetySettings,
		});
		const data = await req.json();
		const prompt = data.body;
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const output = await response.text();

		return NextResponse.json({ output: output });
	} catch (error) {
		console.log(error);
	}
}
