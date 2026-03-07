/** @format */

import fs from "fs/promises";
import matter from "gray-matter";
import { marked } from "marked";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "../../components/Container";

export const metadata: Metadata = {
	title: "Changelog | Troof!",
};

export default async function ChangelogPage() {
	const fileName = await fs.readFile(`changelog.md`, "utf-8");
	const { content } = matter(fileName);

	return (
		<Container>
			<div className="prose mx-auto">
				<div className="my-3">
					<Link href="/">Go home</Link>
				</div>
				<div
					className="mt-20"
					dangerouslySetInnerHTML={{
						__html: marked.parse(content),
					}}
				/>
			</div>
		</Container>
	);
}
