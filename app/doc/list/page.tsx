import { getDocsInfo } from "@/actions/actions";
import { dateConverter } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const DocumentList = async () => {
	const clerkUser = await currentUser();
	const { sessionClaims } = await auth();

	const roomDocuments = await getDocsInfo();
	console.log(roomDocuments.data.metadata);

	return (
		<div>
			<div className="flex flex-col justify-center items-center">
				<h1 className="font-2xl font-bold flex justify-center items-center">
					My Document List
				</h1>
				<hr className="w-full max-w-[500px] my-3 flex justify-center items-center" />
			</div>

			<div className="w-full flex flex-row flex-wrap gap-10 ml-5 mt-5">
				{roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
					<div key={id} className="w-[250px] max-w-[350px]">
						{sessionClaims?.email === metadata.creatorId && (
							<Card key={id}>
								<CardHeader className="flex flex-col justify-center items-center">
									<CardTitle className="flex flex-row justify-center items-center">
										<Image
											className="mr-4"
											src="/notes.svg"
											alt="noteIcon"
											width={28}
											height={28}
										/>
										{metadata.title}
									</CardTitle>
									<CardDescription>{metadata.creatorId}</CardDescription>
								</CardHeader>
								<CardFooter className="text-sm text-slate-600 justify-end">
									{dateConverter(createdAt)}
								</CardFooter>
							</Card>
						)}
					</div>
				))}
			</div>
		</div>
	);
};
export default DocumentList;
