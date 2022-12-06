import Link from "next/link";
import Container from "../components/Container";

export default function CautionPage() {
	return (
		<Container>
			<div className="prose my-10 mx-auto">
				<h1>Notice</h1>

				<p>
					At Troof, we strive to provide a fun and engaging game that
					promotes bonding and good-natured competition. We do our
					best to filter out extreme truths and dares, and we
					encourage players to respect each other and the game&apos;s
					values.
				</p>

				<p>
					However,{" "}
					<b>we do not condone any form of sexual harassment</b>.{" "}
					<b>
						If you feel harassed while playing Troof, please contact
						the relevant authorities immediately.
					</b>
				</p>

				<h3>Mature Content Disclaimer</h3>

				<p>
					Troof is a game for adults only. It contains mature and
					sexual content and is not suitable for players under the
					legal age for viewing such content in your area. By playing
					Troof, you confirm that you are of legal age to view mature
					and sexual content in your area.
				</p>

				<h3>Chat Disclaimer</h3>

				<p>
					Troof is not responsible for the content that is sent in the
					game&apos;s chat box. Players are advised to exercise
					caution when viewing and interacting with the content, and
					to avoid clicking on any links or images that they are not
					familiar with or do not trust. Troof cannot be held
					responsible for any damage or harm that may result from
					viewing or interacting with the chat box content.
				</p>

				<h3>
					Privacy Policy, Terms of Service and your rights as a player
					and a user of our service
				</h3>

				<footer>
					<p>
						After reading our disclaimers, we highly recommend that
						you read our <Link href="/terms">terms of service</Link>{" "}
						and <Link href="/privacy">privacy policy</Link> page. It
						is important to us that players know their rights as a
						player of the game and a user of our service.
					</p>
				</footer>
			</div>
		</Container>
	);
}
