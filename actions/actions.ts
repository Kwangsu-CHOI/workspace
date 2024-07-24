"use server";

import { db } from "@/firebase";
import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { parseStringify } from "@/lib/utils";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { collection } from "firebase/firestore";
import { revalidatePath } from "next/cache";

import { nanoid } from "nanoid";

export async function createNewDocument() {
	auth().protect();
	const roomId = nanoid();
	console.log(roomId);
	const { sessionClaims } = await auth();

	const docCollectionRef = adminDb.collection("documents");
	const docRef = await docCollectionRef.add({
		title: "New Document",
	});

	await adminDb
		.collection("user")
		.doc(sessionClaims?.email!)
		.collection("rooms")
		.doc(docRef.id)
		.set({
			userId: sessionClaims?.email!,
			role: "owner",
			createdAt: new Date(),
			roomId: docRef.id,
		});

	const metadata = {
		creatorId: sessionClaims?.email!,
		email: sessionClaims?.email!,
		title: "New Document",
	};

	const room = await liveblocks.createRoom(docRef.id, {
		metadata,

		defaultAccesses: [],
	});

	return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
	auth().protect();

	console.log("deleteDocument", roomId);

	try {
		await adminDb.collection("documents").doc(roomId).delete();

		const query = await adminDb
			.collectionGroup("rooms")
			.where("roomId", "==", roomId)
			.get();

		const batch = adminDb.batch();
		query.docs.forEach((doc) => {
			batch.delete(doc.ref);
		});

		await batch.commit();

		await liveblocks.deleteRoom(roomId);

		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function inviteUserToDocument(roomId: string, email: string) {
	auth().protect();

	console.log("inviteUserToDocument", roomId, email);

	try {
		await adminDb
			.collection("user")
			.doc(email)
			.collection("rooms")
			.doc(roomId)
			.set({
				userId: email,
				role: "editor",
				createdAt: new Date(),
				roomId,
			});
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export async function removeUserFromDocument(roomId: string, email: string) {
	auth().protect();

	console.log("removeUserFromDocument", roomId, email);

	try {
		await adminDb
			.collection("user")
			.doc(email)
			.collection("rooms")
			.doc(roomId)
			.delete();
		console.log("deleted");
		return { success: true };
	} catch (error) {
		console.error(error);
		return { success: false };
	}
}

export const getDocsInfo = async () => {
	try {
		const rooms = await liveblocks.getRooms();

		return parseStringify(rooms);
	} catch (error) {
		console.log(`Error Occurs getting rooms:${error}`);
	}
};

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
	try {
		const { data } = await clerkClient.users.getUserList({
			emailAddress: userIds,
		});

		const users = data.map((user) => ({
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			email: user.emailAddresses[0].emailAddress,
			avatar: user.imageUrl,
		}));

		const sortedUsers = userIds.map((email) =>
			users.find((user) => user.email === email)
		);

		return parseStringify(sortedUsers);
	} catch (error) {
		console.log(`Error fetching users: ${error}`);
	}
};

export const getDocumentUsers = async ({
	roomId,
	currentUser,
	text,
}: {
	roomId: string;
	currentUser: string;
	text: string;
}) => {
	try {
		const room = await liveblocks.getRoom(roomId);
		const users = Object.keys(room.usersAccesses).filter(
			(email) => email !== currentUser
		);

		if (text.length) {
			const lowerCaseText = text.toLowerCase();

			const filteredUsers = users.filter((email: string) =>
				email.toLowerCase().includes(lowerCaseText)
			);

			return parseStringify(filteredUsers);
		}

		return parseStringify(users);
	} catch (error) {
		console.log(`Error occurs while fetching users: ${error}`);
	}
};

export const updateRoomTitle = async (roomId: string, title: string) => {
	const updatedRoom = await liveblocks.updateRoom(roomId, {
		metadata: {
			title,
		},
	});
	return parseStringify(updatedRoom);
};
