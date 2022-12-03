import fs from "fs/promises";
import matter from "gray-matter";
import md from "markdown-it";
import Head from "next/head";
import Container from "../components/Container";

export async function getStaticProps({}: { [prop: string]: any }) {
	const fileName = await fs.readFile(`changelog.md`, "utf-8");
	const { data: frontmatter, content } = matter(fileName);
	return {
		props: {
			frontmatter,
			content,
		},
	};
}

export default function Post({ content }: { [prop: string]: any }) {
	return (
		<>
			<Head>
				<title>Changelog</title>
			</Head>
			<Container>
				<div className="prose mx-auto">
					<div
						className="mt-20"
						dangerouslySetInnerHTML={{
							__html: md().render(content),
						}}
					/>
				</div>
			</Container>
		</>
	);
}
