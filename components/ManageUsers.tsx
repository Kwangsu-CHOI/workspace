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
import { useState, useTransition } from "react";
import { Button } from "./ui/button";

import { removeUserFromDocument } from "@/actions/actions";
import { toast } from "sonner";

import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react/suspense";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";

function ManageUsers() {
	const { user } = useUser();
	const room = useRoom();
	const isOwner = useOwner();

	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const [usersInRoom] = useCollection(
		user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
	);

	const handleDelete = (userId: string) => {
		startTransition(async () => {
			if (!user) return;

			const { success } = await removeUserFromDocument(room.id, userId);
			if (success) {
				console.log(room.id, userId, success);
				toast.success("User removed from this document");
			} else {
				toast.error("Failed to remove this user");
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Button
				className="h-8 hover:bg-slate-500 hover:text-white"
				asChild
				variant="outline"
			>
				<DialogTrigger className="text-xs">
					Users ({usersInRoom?.docs.length})
				</DialogTrigger>
			</Button>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Users with Access</DialogTitle>
					<DialogDescription>
						List of Users who have access to this document.
					</DialogDescription>
				</DialogHeader>

				<hr className="my-2" />

				<div className="flex flex-col space-y-2">
					{usersInRoom?.docs.map((doc) => (
						<div
							key={doc.data().userId}
							className="flex items-center justify-between"
						>
							<p className="font-light">
								{doc.data().userId === user?.emailAddresses[0].toString()
									? `YOU (${doc.data().userId})`
									: doc.data().userId}
							</p>

							<div className="flex items-center gap-2">
								<Button variant="outline">{doc.data().role}</Button>

								{isOwner &&
									doc.data().userId !== user?.emailAddresses[0].toString() && (
										<Button
											variant="destructive"
											onClick={() => handleDelete(doc.data().userId)}
											disabled={isPending}
											size="sm"
										>
											{isPending ? "Removing..." : "X"}
										</Button>
									)}
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ManageUsers;
