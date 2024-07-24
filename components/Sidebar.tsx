"use client";
import { MenuIcon } from "lucide-react";
import NewDoucmentButton from "./NewDoucmentButton";
import { useCollection } from "react-firebase-hooks/firestore";
import SidebarOption from "./SidebarOption";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import {
	collectionGroup,
	DocumentData,
	query,
	where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import liveblocks from "@/lib/liveblocks";

interface RoomDocument extends DocumentData {
	createdAt: string;
	role: "owner" | "editor";
	roomId: string;
	userId: string;
}

function Sidebar() {
	const { isSignedIn, user } = useUser();
	const [groupedData, setGroupedData] = useState<{
		owner: RoomDocument[];
		editor: RoomDocument[];
	}>({
		owner: [],
		editor: [],
	});
	const [data, loading, error] = useCollection(
		user &&
			query(
				collectionGroup(db, "rooms"),
				where("userId", "==", user.emailAddresses[0].toString())
			)
	);

	useEffect(() => {
		if (!data) return;
		const grouped = data.docs.reduce<{
			owner: RoomDocument[];
			editor: RoomDocument[];
		}>(
			(acc, curr) => {
				const roomData = curr.data() as RoomDocument;

				if (roomData.role === "owner") {
					acc.owner.push({
						id: curr.id,
						...roomData,
					});
				} else {
					acc.editor.push({
						id: curr.id,
						...roomData,
					});
				}
				return acc;
			},
			{
				owner: [],
				editor: [],
			}
		);

		setGroupedData(grouped);
	}, [data]);

	const menuOptions = (
		<>
			<NewDoucmentButton />
			{isSignedIn ? (
				<div className="flex py-4 flex-col space-y-4 md:max-w-36">
					{/* My docs */}
					{groupedData.owner.length === 0 ? (
						<h2 className="text-gray-500 font-semibold text-sm">
							{" "}
							No Document Found
						</h2>
					) : (
						<>
							<h2 className="text-gray-500 font-semibold text-sm">
								My Documents
							</h2>
							{groupedData.owner.map((doc) => (
								<SidebarOption
									key={doc.id}
									id={doc.id}
									href={`/doc/${doc.id}`}
								/>
							))}
						</>
					)}

					{/* shared docs */}
					{groupedData.editor.length > 0 && (
						<>
							{groupedData.editor.length === 1 ? (
								<h2 className="text-gray-500 font-semibold text-sm">
									Shared Document
								</h2>
							) : (
								<h2 className="text-gray-500 font-semibold text-sm">
									Shared Documents
								</h2>
							)}

							{groupedData.editor.map((doc) => (
								<SidebarOption
									key={doc.id}
									id={doc.id}
									href={`/doc/${doc.id}`}
								/>
							))}
						</>
					)}
					{/* list... */}
				</div>
			) : (
				""
			)}
		</>
	);

	if (!isSignedIn) {
		const status = "hidden";
	} else {
		const status = "p-2 md:p-5 bg-[#FEFBF6] relative";
	}

	return (
		<div>
			{isSignedIn ? (
				<div className="p-2 md:p-5 bg-[#FEFBF6] relative">
					<div className="md:hidden">
						<Sheet>
							<SheetTrigger>
								<MenuIcon
									className="p-2 hover:opacity-30 rounded-lg"
									size={40}
								/>
							</SheetTrigger>
							<SheetContent side="left">
								<SheetHeader>
									<SheetTitle>Menu</SheetTitle>
									<div>{menuOptions}</div>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
					<div className="hidden md:inline">{menuOptions}</div>
				</div>
			) : (
				""
			)}
		</div>
	);
}

export default Sidebar;
