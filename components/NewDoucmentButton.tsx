"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";
import { useUser } from "@clerk/nextjs";

function NewDoucmentButton() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { isSignedIn } = useUser();

	const handleCreateNewDocument = () => {
		startTransition(async () => {
			const { docId } = await createNewDocument();
			router.push(`/doc/${docId}`);
		});
	};

	return (
		<Button
			onClick={handleCreateNewDocument}
			disabled={isPending}
			className={`bg-[#2B3467] hover:bg-[#92B4EC] hover:text-[#2B3467] ${
				!isSignedIn && "hidden"
			}`}
		>
			{isPending ? "Creating..." : "New Document"}
		</Button>
	);
}

export default NewDoucmentButton;
