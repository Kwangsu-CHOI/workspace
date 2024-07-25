"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { ArrowLeftCircle, Router } from "lucide-react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
	const { isSignedIn, user } = useUser();

	return (
		<main
			className={`flex items-center mt-1 ${
				isSignedIn ? "justify-start" : "justify-center"
			}`}
		>
			{isSignedIn ? (
				<div className="flex space-x-2 items-center justify-start animate-pulse">
					<ArrowLeftCircle className="w-8 h-8" />
					<h1 className="font-bold">
						Get started with creating a New Document!
					</h1>
					<Link href="/doc/list">
						<Button className="bg-black text-white mr-1">My List</Button>
					</Link>
				</div>
			) : (
				<div>
					<div className="flex justify-between items-center gap-2 mt-5 md:flex-row lg:flex-row flex-col">
						<div>
							<Image
								src="/workspace.jpg"
								alt="workspace"
								width={500}
								height={300}
								className="w-full "
							/>
						</div>
						<div className="max-w-[535px] w-full flex flex-col justify-center p-7 bg-[#D6EFD8]">
							<div className="flex flex-col item-start items-center">
								<h1 className="text-2xl">Create your workspace</h1>
								<div className="flex items-baseline">
									<h2 className="text-2xl font-bold text-red-400">AND</h2>
									<h2 className="">&nbsp; collaborate with others!</h2>
								</div>
							</div>
							<hr className="w-full my-3" />
							<div className="flex justify-center gap-5">
								<div className="flex flex-col">
									<p className="text-sm font-light mb-1">Have an account?</p>
									<div>
										<Button className="bg-[#06D001]">
											<a href="/sign-in">Sign in</a>
										</Button>
									</div>
								</div>
								<div className="flex flex-col">
									<p className="text-sm font-light mb-1">New User?</p>
									<div>
										<Button className="bg-[#5755FE]">
											<a href="/sign-up">Sign up</a>
										</Button>
									</div>
								</div>
								{/* <div className="flex flex-col">
									<p className="text-sm font-light mb-1">Have a question?</p>
									<div>
										<Button className="bg-[#8C7676]">
											<a href="#">Contact me</a>
										</Button>
									</div>
								</div> */}
							</div>
						</div>
					</div>
					<div className="flex flex-col item-start justify-start bg-white w-full p-4">
						<p className="mt-3 text-2xl font-extrabold text-[#EB455F]">FAQ</p>
						<Accordion type="single" collapsible>
							<AccordionItem value="item-1">
								<AccordionTrigger>Can I invite other users?</AccordionTrigger>
								<AccordionContent>
									Yes. You can simply invite other collaborators by adding email
									to give them a permission to edit your document.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-2">
								<AccordionTrigger>Can I manage collaborators?</AccordionTrigger>
								<AccordionContent>
									Yes. You can add/remove collaborator very easily.
								</AccordionContent>
							</AccordionItem>
							<AccordionItem value="item-3">
								<AccordionTrigger>
									Does it allow collaborators edit a document simultaneously?
								</AccordionTrigger>
								<AccordionContent>
									Yes. It enable people to edit documents at the same time. You
									can check where they are editing in live.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
			)}
		</main>
	);
}
