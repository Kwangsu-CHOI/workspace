import { SignUp } from "@clerk/nextjs";

export default function Home() {
	return (
		<main className="flex justify-center items-center mt-10">
			<SignUp />
		</main>
	);
}
