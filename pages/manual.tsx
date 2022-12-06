import Link from "next/link";
import Container from "../components/Container";
import CautionSection from "../components/home/CautionSection";

export default function ManualPage() {
	return (
		<Container>
			<div className="prose my-5 mx-auto">
				<Link href="/">Go home</Link>

				<h2>Welcome to the holy grail game manual!</h2>

				<h3>What is Troof?</h3>
				<p>
					Welcome to Troof, the exciting new truth or dare game that
					lets friends bond closer and have an unforgettable
					experience.
				</p>

				<p>
					With Troof, you can chat, react, and choose from over 290+
					truths and dares* to test your limits and challenge your
					friends.
				</p>

				<p>
					Whether you&apos;re playing with friends in person or
					online, Troof offers endless possibilities for fun and
					excitement.
				</p>

				<i>* More truths and dares will be added in a later stage</i>

				<h3>Instructions</h3>

				<div className="text-center">
					<CautionSection />
				</div>

				<h4>Creating/Joining a room</h4>
				<ol>
					<li>
						To start a game, create a new room or join an existing
						one.
					</li>

					<li>
						To invite other players to join your game, click on the
						&quot;invite players&quot; or &quot;room code&quot;
						button. This will copy an invite link that you can then
						send to the players you wish to invite. They can click
						on the link to join your game and start playing with
						you. You can also share the room code with players if
						you prefer, which they can enter on the main menu to
						join your game.
					</li>
				</ol>

				<h4>The game itself</h4>
				<ol>
					<li>
						Players take turns selecting &quot;truth&quot; or
						&quot;dare&quot; from the options provided.
					</li>

					<li>
						After selecting a truth or dare, you will be given an
						instruction to follow.
					</li>

					<ul>
						<li>
							If the instruction requires you to do something
							physical, you can either screen share, record a
							video, or turn on your webcam to show the group.
						</li>

						<li>
							If the instruction is a truth, you can answer it in
							the chat message or via voice if you are playing in
							a face-to-face setting.
						</li>
					</ul>

					<li>
						Players may also use the chat feature to communicate
						with each other and share their experiences during the
						game.
					</li>

					<li>
						Continue taking turns and completing truths or dares
						until all players have had a chance to participate.
					</li>

					<li>Have fun and enjoy the game!</li>
				</ol>

				<h4>The Party Leaders</h4>

				<p>
					The party leader, who will be indicated by a crown icon
					beside their name, has the ability to kick players from the
					room and force skip a player&apos;s turn. These actions
					should only be used in appropriate circumstances to ensure
					that all players are having a fair and enjoyable experience.
				</p>

				<h4>The ability to re-roll</h4>
				<p>
					Players have the option to re-roll their truth or dare if
					they are not satisfied with their original selection. This
					can be done without skipping their turn, but should be used
					sparingly to allow other players a fair chance to play as
					well. We encourage players to carefully consider their
					original selection before choosing to re-roll.
				</p>

				<h3>Recommended way to play</h3>
				<p>
					While Troof offers chat functionality, it is still best
					played in a scenario where players can communicate with each
					other face-to-face. This added level of interaction and
					engagement enhances the excitement and thrill of the game,
					making it an unforgettable experience for players.
				</p>

				<p>That&quot;s basically it</p>

				<Link href="/">Go home</Link>

				<p>
					If you have a few more minutes to spare, we would appreciate
					if you took the time to read the below section for more
					information
				</p>

				<h3>Legal</h3>

				<p>
					<p>
						Please note that Troof and its creator are not legally
						responsible for any actions or consequences resulting
						from players not exercising their own responsibility. As
						a reminder, a warning has been provided and it is the
						player&quot;s responsibility to exercise caution while
						playing. By using Troof, players accept and acknowledge
						this disclaimer and agree to be responsible for their
						own actions.
					</p>
				</p>

				<h3>Finally...</h3>
				<p>
					Please note that Troof is currently in beta testing and is
					not yet a finished product. As a result, some features, user
					interface elements, and overall experiences may change when
					new versions of the game are released. We appreciate your
					understanding and feedback as we continue to improve and
					refine the game. Thank you for your support and we hope you
					have a great time playing Troof!
				</p>

				<h3>A message from the creator</h3>

				<p>
					Thank you for choosing to play Troof! We are thrilled that
					you are enjoying our game and are grateful for your support.
					As Troof is made by a single developer, we appreciate your
					understanding if you experience any bugs or issues while
					playing. We are dedicated to improving the game and
					addressing any issues that may arise, but in the meantime,
					we hope you have a very enjoyable time playing. Thank you
					again for choosing Troof and we hope to see you back for
					more fun and excitement!
				</p>

				<p>- Nabil</p>

				<Link href="/">Go home</Link>
			</div>
		</Container>
	);
}
