import { getDocsInfo } from "@/actions/actions";
import { dateConverter } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const DocumentList = async () => {
	const clerkUser = await currentUser();

	const roomDocuments = await getDocsInfo();

	return (
		<div>
			<ul>
				{roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
					<li key={id}>
						<Link
							href={`/doc/${id}`}
							className="flex flex-1 items-center gap-4"
						>
							<div className="hidden rounded-md bg-[#393E46] p-2 sm:block"></div>
							<div className="space-y-1">
								<p className="line-clamp-1 text-lg">{metadata.title}</p>
								<p className="text-sm font-light text-[#393E46]">
									Created about {dateConverter(createdAt)}
								</p>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};
export default DocumentList;
