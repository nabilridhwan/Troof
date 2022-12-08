/** @format */

import Head from "next/head";
import Link from "next/link";
import Container from "../components/Container";

export default function PrivacyPolicyPage() {
	return (
		<>
			<Head>
				<title>Privacy Policy</title>
				<meta
					name="description"
					content="Privacy Policy for the website of the game 'Troof!'"
				/>
			</Head>
			<Container>
				<div className="prose mx-auto my-10">
					<h1>Privacy Policy</h1>

					<p>
						Our application does not track any data from our users. The only
						data that we collect and store is the display name, chat messages,
						reactions and room codes that are voluntarily provided by our users
						for the purpose of using our application. This data is used solely
						to ensure that our application is functioning properly and to
						provide our users with the services they have requested.
					</p>

					<p>
						We take the privacy of our users seriously and take appropriate
						measures to protect the data that we collect. This includes using
						secure servers to store the data and implementing appropriate
						security measures to prevent unauthorized access.
					</p>

					<p>
						If you have any questions or concerns about our privacy policy or
						the data that we collect and store, please contact me over at github
						@nabilridhwan.
					</p>

					<Link href="/">Go home</Link>
				</div>
			</Container>
		</>
	);
}
