"use client";

import * as Y from "yjs";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";
import Markdown from "react-markdown";
import model from "@/lib/gemini";

type Language =
	| "english"
	| "korean"
	| "japanese"
	| "chinese"
	| "spanish"
	| "french"
	| "arabic"
	| "hindi"
	| "rusian";

const languages: Language[] = [
	"english",
	"korean",
	"japanese",
	"chinese",
	"spanish",
	"french",
	"arabic",
	"hindi",
	"rusian",
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
	const [isOpen, setIsOpen] = useState(false);
	const [language, setLanguage] = useState<string>("");
	const [summary, setSummary] = useState("");
	const [question, setQuestion] = useState("");

	const [isPending, startTransition] = useTransition();

	const handleAskQuestion = (e: FormEvent) => {
		e.preventDefault();

		startTransition(async () => {
			const documentData = doc.get("document-store").toJSON();

			const prompt = `You are going to summarize ${documentData} and translate summarized text in ${language}. `;

			// If ${input} is start with ! mark, you do not give a summary for ${documentData} but answer ${input}, which is start with ! mark.
			const result = await model.generateContent(prompt);

			if (result) {
				const response = await result.response;
				const text = response.text();

				setSummary(text);

				toast.success("Translation completed");
			}

			// const res = await fetch(
			// 	`${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
			// 	{
			// 		method: "POST",
			// 		headers: {
			// 			"Content-Type": "application/json",
			// 		},
			// 		body: JSON.stringify({
			// 			documentData,
			// 			targetLang: language,
			// 		}),
			// 	}
			// );
			// console.log(res);

			// if (res.ok) {
			// 	const { translated_text } = await res.json();

			// 	setSummary(translated_text);
			// 	toast.success("Translation successfully completed");
			// }
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Button asChild variant="outline">
				<DialogTrigger>
					<LanguagesIcon />
					<p className="hidden md:block lg:block">Translate</p>
				</DialogTrigger>
			</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Translate the Document with AI</DialogTitle>
					<DialogDescription>
						Select a language from below and AI will give you a summary of
						document in the selected language
					</DialogDescription>

					<hr className="mt-5" />

					{question && <p className="mt-5 text-gray-500">Q: {question}</p>}
				</DialogHeader>

				{summary && (
					<div className="flex flex-col items-start max-h-96 overflow-y-scroll p-5 gap-2 bg-gray-100">
						<div className="flex">
							<BotIcon className="w-10 flex-shrink-0" />
							<p className="font-bold">
								GPT {isPending ? "is still thinking..." : "says:"}
							</p>
						</div>
						<p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
					</div>
				)}

				<form className="flex gap-2" onSubmit={handleAskQuestion}>
					<Select
						value={language}
						onValueChange={(value) => setLanguage(value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select a Language" />
						</SelectTrigger>

						<SelectContent>
							{languages.map((language) => (
								<SelectItem key={language} value={language}>
									{language.charAt(0).toUpperCase() + language.slice(1)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						data-tooltip-target="tooltip-default"
						type="submit"
						disabled={!language || isPending}
					>
						{isPending ? "Translating..." : "Translate"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default TranslateDocument;
