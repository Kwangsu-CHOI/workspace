"use client";

import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useEffect, useState } from "react";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { db } from "@/firebase";
import {
	collection,
	collectionGroup,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { adminDb } from "@/firebase-admin";

// async function fetchDocumentData() {
// 	const querySnapshot = await getDocs(collection(db, "documents"));
// 	const data: any = [];
// 	querySnapshot.forEach((doc) => {
// 		data.push({ id: doc.id, ...doc.data() });
// 	});
// 	return data;
// }

function Breadcrums() {
	const path = usePathname();
	const segments = path.split("/");
	// const [roomData, setRoomData] = useState<any[]>([]);
	// const room = segments[2];
	// const [roomTitle, setRoomTitle] = useState("");

	// async function fetchDatas() {
	// 	const querySnapshot = await getDocs(collection(db, "documents"));
	// 	let database: Array<{ id: string }> = [];
	// 	querySnapshot.forEach((doc) => {
	// 		database.push({ id: doc.id, ...doc.data() });
	// 	});
	// 	setRoomData(database);
	// 	const a = database.find((roomN) => roomN.id === room);
	// 	const b = Object.values(a);
	// 	const c = b[1];
	// 	setRoomTitle(c);
	// 	return c;
	// }
	// useEffect(() => {
	// 	fetchDatas();
	// }, []);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">
						<p className="text-[0.75rem]">Home</p>
					</BreadcrumbLink>
				</BreadcrumbItem>

				{segments.map((segment, index) => {
					if (!segment) return null;
					const href = `/${segments.slice(0, index + 1).join("/")}`;

					const isLast = index === segments.length - 1;

					return (
						<Fragment key={segment}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{segment === "doc" ? (
									<BreadcrumbPage>
										<p className="text-[0.75rem]">{segment}</p>
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={href}>
										<p className="text-[0.75rem]">{segment}</p>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export default Breadcrums;
