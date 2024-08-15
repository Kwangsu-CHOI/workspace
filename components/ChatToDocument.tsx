"use client";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Input } from "./ui/input";
import * as Y from "yjs";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

function ChatToDocument({ doc }: { doc: Y.Doc }) {
	const [input, setInput] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [summary, setSummary] = useState("");
	const [question, setQuestion] = useState("");

	const handleAskQuestion = async (e: FormEvent) => {
		e.preventDefault();

		setQuestion(input);

		startTransition(async () => {
			const documentData = doc.get("document-store").toJSON();

			const prompt = `You are going to give me a brief summary based on ${documentData} or answer my question, which is ${input}, based on ${documentData}. If you think a ${input} is not relevant to contents or texts in ${documentData}, You do not need to mention anything about ${documentData} but only return a general answer for the ${input}.`;

			// If ${input} is start with ! mark, you do not give a summary for ${documentData} but answer ${input}, which is start with ! mark.

			const response = await fetch("/api/generate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ body: prompt }),
			});
			const data = await response.json();
			if (response.ok) {
				setInput("");
				setSummary(data.output);
			} else {
				setSummary(data.error);
			}

			// const result = await model.generateContent(prompt);

			// if (result) {
			// 	const response = await result.response;
			// 	const text = response.text();

			// 	setInput("");
			// 	setSummary(text);

			// 	toast.success("Question asked successfully!!!");
			// }

			// const res = await fetch(
			// 	`${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
			// 	{
			// 		method: "POST",
			// 		headers: {
			// 			"Content-Type": "application/json",
			// 		},
			// 		body: JSON.stringify({
			// 			documentData,
			// 			question: input,
			// 		}),
			// 	}
			// );

			// if (res.ok) {
			// 	const { message } = await res.json();

			// 	setInput("");
			// 	setSummary(message);

			// 	toast.success("Question asked successfully!!!");
			// }
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Button asChild variant="outline">
				<DialogTrigger>
					<MessageCircleCode className="" />
					<p className="hidden md:block lg:block">Ask about Doc</p>
				</DialogTrigger>
			</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ask about this Document to AI!</DialogTitle>
					<DialogDescription>
						Chat with AI about anything in this document. However, it can also
						give you an answer for other general questions. `e.g. Am I
						handsome?`
					</DialogDescription>

					<hr className="mt-5" />

					{question && <p className="mt-5 text-gray-500">Q: {question}</p>}
				</DialogHeader>

				{summary && (
					<div className="flex flex-col items-start max-h-96 overflow-y-scroll p-5 gap-2 bg-gray-100">
						<div className="flex">
							<BotIcon className="w-10 flex-shrink-0" />
							<p className="font-bold">
								AI {isPending ? "is still thinking..." : "says:"}
							</p>
						</div>
						<p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
					</div>
				)}

				<form className="flex gap-2" onSubmit={handleAskQuestion}>
					<Input
						type="text"
						placeholder="ex) what is this about?"
						className="w-full"
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button type="submit" disabled={!input || isPending}>
						{isPending ? "Asking..." : "ASK"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default ChatToDocument;
