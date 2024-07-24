"use client";

import {
	SignedOut,
	SignedIn,
	SignInButton,
	UserButton,
	useUser,
} from "@clerk/nextjs";
import Breadcrums from "./Breadcrums";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRoom } from "@liveblocks/react/suspense";

function Header() {
	const { user } = useUser();

	return (
		<div className="flex items-center justify-between p-2 border-b border-slate-300">
			{user ? (
				<a href="/" className="flex items-center">
					<Image
						src="/logo.svg"
						alt="Logo"
						width={40}
						height={40}
						className="w-[40px] h-[40px]"
					/>
					<h1 className="text-[1rem]">
						{user?.firstName}
						{`'s`} Workspace
					</h1>
				</a>
			) : (
				<div className="flex items-center">
					<Image
						src="/logo.svg"
						alt="Logo"
						width={32}
						height={32}
						className="mr-2 "
					/>
					<h1 className="text-xl font-bold font-lexen">Workspace</h1>
				</div>
			)}

			{/* path examples */}
			<Breadcrums />

			<div>
				<SignedOut>
					<Button>
						<SignInButton />
					</Button>
				</SignedOut>

				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</div>
	);
}

export default Header;
