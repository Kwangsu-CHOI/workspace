"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avartars from "./Avartars";

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import { updateRoomTitle } from "@/actions/actions";

function Document({ id }: { id: string }) {
	const [data, loading, error] = useDocumentData(doc(db, "documents", id));

	const [input, setInput] = useState("");

	const [isUpdating, startTransition] = useTransition();

	const isOwner = useOwner();

	useEffect(() => {
		if (data) {
			setInput(data.title);
		}
	}, [data]);

	const updateTitle = (e: FormEvent) => {
		e.preventDefault();

		if (input.trim()) {
			startTransition(async () => {
				await updateDoc(doc(db, "documents", id), {
					title: input,
				});
				updateRoomTitle(id, input);
			});
		}
	};

	return (
		<div className="flex-1 h-full bg-white p-5 border">
			<div className="flex max-w-6xl mx-auto justify-between pb-5">
				<form className="flex space-x-2" onSubmit={updateTitle}>
					{/* update title.. */}
					<Input value={input} onChange={(e) => setInput(e.target.value)} />

					<Button
						className="hidden md:block lg:block"
						disabled={isUpdating}
						type="submit"
					>
						{isUpdating ? "Updating..." : "Update"}
					</Button>

					{isOwner && (
						<>
							<div className="hidden gap-4 justend md:flex lg:flex">
								<DeleteDocument />
								<InviteUser />
							</div>
							<div className=" md:hidden lg:hidden flex items-center justify-center">
								<Drawer>
									<DrawerTrigger>
										<Image
											src="/setting.svg"
											alt="setting"
											width={30}
											height={30}
										/>
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader>
											<DrawerTitle>Settings</DrawerTitle>
										</DrawerHeader>
										<DrawerFooter>
											<p>Update title</p>
											<Button disabled={isUpdating} type="submit">
												{isUpdating ? "Updating..." : "Update"}
											</Button>
											<p>Invite user</p>
											<InviteUser />
											<p>Delete document</p>
											<DeleteDocument />
											<DrawerClose>
												<Button variant="outline">Cancel</Button>
											</DrawerClose>
										</DrawerFooter>
									</DrawerContent>
								</Drawer>
							</div>
						</>
					)}
				</form>
			</div>

			<div className="flex max-w-6xl mx-auto justify-between items-center mb-2">
				{/* Manage user */}
				<ManageUsers />

				{/* avatar */}
				<Avartars />
			</div>

			<hr className="pb-3" />

			{/* collabo editor */}
			<Editor />
		</div>
	);
}

export default Document;
