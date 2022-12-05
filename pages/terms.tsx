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
					<h1>Terms Of Service</h1>
					<p>
						By accessing and using our game, you agree to be bound
						by the following terms and conditions (the "Terms of
						Service" or "TOS"). If you do not agree to these terms,
						do not use our game.
					</p>

					<h3>1. Rights and Responsibilities.</h3>

					<p>
						As a user of our game, you have the right to access and
						play the game in accordance with these TOS. You are
						responsible for ensuring that you do not abuse our
						servers or engage in any other activities that may
						interfere with the operation of the game. If we
						determine that you have abused our servers or otherwise
						violated these TOS, we reserve the right to ban you from
						the game indefinitely.
					</p>
					<h3>2. Limitations of Liability.</h3>

					<p>
						We are not liable for any damages or losses that may
						arise from your use of our game. The game may contain
						mature content and participants are responsible for
						exercising caution while playing and should not
						participate if they feel uncomfortable due to this
						content.
					</p>
					<h3>3. Dispute Resolution.</h3>

					<p>
						We hope that there will not be any need for disputes
						between us and our users. However, if a dispute does
						arise, you agree to resolve it with us directly and in
						good faith. If we are unable to resolve the dispute to
						your satisfaction, you agree to waive any right to
						pursue legal action against us.
					</p>
					<h3>4. Modification of TOS.</h3>

					<p>
						We reserve the right to modify these TOS at any time and
						without prior notice. Your continued use of our game
						after any changes have been made will constitute your
						acceptance of the revised TOS.
					</p>
					<h3>5. Data Collection and Use.</h3>

					<p>
						We collect and use certain data in connection with your
						use of our game. This data is used to provide and
						improve our services and for other purposes as described
						in our Privacy Policy. By using our game, you consent to
						the collection and use of this data in accordance with
						our Privacy Policy.
					</p>
					<Link href="/">Go home</Link>
				</div>
			</Container>
		</>
	);
}
