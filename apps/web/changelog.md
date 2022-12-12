## Version - 1.0.0

The stable version is finally here! I am proud to finally release a stable version of the game after weeks of hard work on security and optimizing the user interface and user experience. 🙂✌️

### Client - 1.0.0

- **[NEW]** Now the Chat box has a limit of 150 characters.
  - There is also a small character counter as part of this new update.
- **[SECURITY]** The game just got that much more secure! When a person joins a room, they're given a unique key that is only to them. This will disallow:
  - Unauthorized changing of party leader to someone else if they're not the party leader.
  - Unauthorized skipping of turns.
  - Unauthorized joining of games.
- Fixed an issue that the "Player is typing" is broadcasted to all playing games.
- The "Accidentally left game" pop-up box won't disturb you again if you press on "It's intentional!"
- **[DEV]** Made token as part of the extra headers in socket.io.
- **[DEV]** Removed the need of separate `sendMessage` and `sendReaction` in ChatBox. It is one method sendMessage with two arguments, first being content and second being the type ("message" | "reaction")

### Packages

- Added `@troof/jwt`, a package for the help of generating and verifying JWT tokens.
- Updated `@troof/socket` to support the new JWT token system and remove redundant code with the introduction of the new JWT system.

### Server - 1.0.0

- Fixed an issue that the "Player is typing" is broadcasted to all playing games.
- Included security barriers for all handlers to either check if the player is part of the room, party leader or many more and will reject if unauthorized.
- Added socket.io middleware for token handling.

## Version - 0.3.12

### What's new (Client - 0.3.12)

- _Not in the previous release notes_, but, we added a new badge to the Chat box that all messages are end-to-end encrypted.
- All joining and creation of rooms are now handled by the frontend and not the serverless functions by Vercel.
  - This is because due to the nature of the current E2EE implementation, the serverless function may timeout when trying to create a room!
- Now, when you click on "Join Room" or "Create Room", the button will be disabled and a loading spinner will be shown. This is to indicate to users that their request is being processed.
- Changed the padding and margins of the RoomCodeSection.
- Now, all invite links is now literally in the address bar. Copy and paste (or alternatively click on the nice shiny copy button) to share the link with your friends!
  - This is to encourage people in existing games to leave their previous games first before joining a new one.

### What's new (Server)

- Nothing new.

### What's new (Packages)

- Nothing new.

## Version - 0.3.11

### What's new (Client - 0.3.11)

- **[NEW]** All your messages sent in chat are end to end encrypted! No one can read and snoop the message unless they're a participant of the room!
  - Due to this feature, all system messages are not shown when someone joins the room! This will be looked into in the future.
- When a user creates a room, it might take longer due to the system generating secret keys for your room!

### What's new (Server - 0.2.12)

- Added support for end to end encryption.

### What's new (Packages)

- Added `@troof/encrypt`, a package for the help of encryption and decryption of messages.
- Updated the database schema to help with private and public keys in `@troof/database`

## Version - 0.3.10

### What's new (Client)

- **[NEW]** Added the ability to transfer the party leader to someone else in the room.
- **[FIXED]** Added back the feature to change your name in game.
  - Note that once you change your name, the previous chat message from you will be considered to be other people's chat messages.
- Cleaned up players section
  - Added a menu dropdown which contains change name, set as party leader* and remove player* (\*only available for party leaders)
- The "Force Skip" button is now renamed to the "Skip" button.
  - The position of the button is now beside the current player's name
- Changed the layout of the room code copy and paste.
- Decreased the border width of the chat text input box.
- Now every time the selection comes out on screen, it will show if it is a 'Truth' or 'Dare'.
- Code cleanup. Cleaned up 2 player states from game page.
- Changed all monospace font to `Azeret Mono`

### What's new (Server - 0.2.11)

- Added support for transfer of party leader status.

### What's new (Packages)

- Added more Client-to-Server and Server-to-Client events and types for support of new features in `@troof/socket`

## Version - 0.3.9

### What's new (Client)

- Changed force skip buttons from teal to orange.
- Now when you accidentally leave the game and go to the home page, you'll be greeted with a modal.
- Now the home screen loads faster.
- Separated version section to be another component, and client side request to server for version.
- Increased height for chat in mobile.
- Fixed a layout issue on mobile for chat that it is too low to the bottom.
- Added an error dialog at home page when the server is experiencing issues.

### What's new (Server)

- Nothing new

### What's new (Packages)

- Add `getServerVersion` in `@troof/api`

## Client - 0.3.8

### What's new (Client)

- Moved from Giphy to Tenor for all Gif related services (including the Gif Picker)
- Now, instead of clicking on a message to reply, you double click (or tap) on a message.

### What's new (Server)

- Nothing new

### What's new (Packages)

- Add Tenor api related stuff in `@troof/api`

## Client - 0.3.7 and Server - 0.2.10

Going forward, we will strive to provide more thorough changelogs. To start, we will include a 'What's New' section for any packages that are critical to our base services and website. 😁✌️

### What's new (Client)

- From now on, the game will be limited to 8 players max.
- Now the Players' section in the game show the number of players in the game. Like this: `Players (2/8)`
- Now, you'll see a proper error message when you encounter an error while joining/creating a game.
- Better error handling when the user doesn't have a connection.
- Changed the 'disconnected' text in the chat box.
- Testing out a new feature where if you're disconnected via mobile, you'll be refreshed in 1.5 seconds instead of normal 3. But for other reasons of disconnection, it'll take 2.5 seconds.

### What's new (Server)

- Add support for player limit in games.
- Add `hpp` and `helmet` for security of server.

### What's new (Packages)

- Add new regex helper method to extract room code from URL.

## Version 0.3.6 and 0.2.9

### What's new

We're excited to announce that nothing changed except for the fact that we adopt TurboRepo. If you're seeing the application on these versions, you're seeing the latest one

## Version 0.3.5 and 0.2.8

### What's new (Client - 0.3.5 and Server - 0.2.8)

- We fixed the issue of messages not replying instantly.

  - To provide the best possible experience for our users, we have implemented an alternative method for handling messages in the Troof chat. Initially, the chat table in the database used an integer primary key, which introduced a delay when sending and receiving messages. Additionally, using an integer as the primary key has an upper limit, which could potentially be reached in the future. However, by using a varchar field with UUID v4 as the primary key, we can generate a unique identifier for each message on the client side and immediately broadcast it back to the user. This allows for instant messaging and enables us to reply to messages instantly without any delays. Plus, using a varchar field with UUID v4 as the primary key removes the potential for reaching an upper limit in the future. Both the frontend and backend added support for these types.

- In the future, we will limit games to only have 8 players max.

## Version 0.3.4

### What's new (Client - 0.3.4)

- The next time you join a game, we will pre-fill your previously used name because we remember :)
- Changed layout of the game page for desktop to better fit laptop screens.
- Fixed typos
- Added the ability to reply to other people's messages
  - This is somewhat a new features, may be unstable.
  - **With this feature introduced, messages sent now has a delay depending on how fast the server responds back!** - We will try to see how this can be optimized in the future!

### What's new (Server - 0.2.7)

- Support for new text messages type (overhaul of types).
- Support for message reply.

## Version 0.3.3

### What's new (Client - v0.3.3)

- Changed layout of game screen.
- Increase width of the home screen in desktop.
- Add new Promo image on the home screen.
- Added a pulse effect when it is your turn in the game.
- Fixed: The reaction raining emojis go behind the message box. Now it is fixed.

### What's new (Server - v0.2.6)

- Fixed a bug where the API requires you to have minimum 20 characters for your display name. It should've been maximum instead.

## Version 0.3.2

We are pleased to announce that our servers are finally receiving updates after 2 client updates. These updates will include the implementation of a new, cryptographically secure random number generator that will be used to select truths or dares and minor fixes.

### What's new (Client - v0.3.2)

- Adopted new Room IDs. Now we use 4 words separated by dashes (-)
  - An example of this is `sit-steam-two-tin`
  - It increases our possible games to 116,985,856 from 42,875
- Now, desktop users can click on enter after entering display name/room code from the home screen.
  - Previously, you'd have to click the button only
- Updated system message. When a user selects a truth/dare, the system will broadcasst 2 different system messages. 1 for 'X selected Y' and the other is the truth/dare itself.
- Fine tuned raining emojis' animations and also increased emojis from 20 > 30.
- Added a limit to display names. They can now be max of 20 characters.
- Changed the layout of the home page to include image of Troof gameplay.
- We've added the ability to dismiss the mature content warning box. By dismissing the warning, you are acknowledging that you have read and understood the contents of the warning. To access the links that are behind the warning, please head to the bottom of the home page.
- Changed the color of the What's new button on the home page
- Added footer links to all pages

### What's new (Server - v0.2.5)

- Implemented cryptographically secure random number generator for selecting truths and dares
- Support for new Room IDs.
- When games are over, they are not deleted but in fact changed to status of "game_over".
- Updated the system message.

## Version 0.3.1

### What's new (Client - v0.3.1)

- We are currently limiting the rate at which users can give reactions to 1.5 seconds per reaction. This is to prevent spamming and ensure a smooth experience for everyone. Thank you for your understanding.
- Changed the design of the chat box section. Gifs and extra emojis button can be found beside the chat box!
- Fixed an issue where the "emoji rain" effect for reaction does not really do well on mobile.
- Changed input boxes font size.
  - This fixes the issue of mobile players needing to zoom in on the input. Read more [here](https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone)
- Fixed warning on named imports of package.json

### What's new (Server)

- None

## Version 0.3.0

This release is a little unusual, and things may break as a result. If you encounter any issues while playing the game, please submit an issue ticket at Troof's GitHub Issues (https://github.com/nabilridhwan/troof/issues) or contact me on GitHub (@nabilridhwan). We apologize for any inconvenience and appreciate your understanding.

### What's new (Client - v0.3.0)

- **[NEW]** In this update, we are excited to introduce the ability for players to send gifs using the gif picker! We are thrilled to be able to offer this new feature, and we hope that it will enhance the player experience and make the game even more fun and engaging.
- **[NEW]** Now you can format text like how you'd normally do in WhatsApp.
  - `_underscore_` to _italicize_
  - `*asterisk*` to _bold_
  - `~tildes~` to ~~strikethrough~~
- Added the ability to send links/image links in the chat and it will display as links and images.
- We have added a caution page to our game. The home page warning now links to this new caution page, which highlights player safety and rights as a user and a player. We encourage all players to visit the caution page and familiarize themselves with the information and resources provided.

#### Known issues

- When opening the GIF picker and then you click on the emoji button, the GIF Picker closing animation will stutter. This is by the cause of react-emoji-picker. And we'll look into it.
- Removed the feature of emoji bar showing recent/frequent emojis. We'll find a workaround for this in the future.

### What's new (Server)

- Nothing changed.

## Version 0.2.2 - Client and 0.2.2, 0.2.3 and 0.2.4 - Server

This changelog looks different because it includes changes from the previous three iterations (for server). 😅

### Client

#### v0.2.2

- Now, every new message and reaction passed through socket.io will pass the display name. This is to reduce the workload of the server
  - Known Issue: When you change your name, you have to refresh the page so that the new name will display in your message
- You can now see when other players are typing
- In addition so system message for new truths and dares, the system message will now include the actual truth/dare in the system message.
  - This is to give mobile users context while they interact with the chat.
- Increase the width of the chat input box to be full width
  - To help mobile users such that automatically zooming in on the left hand side of the screen and manually zooming out.
- Fixed an issue where players can join a game with no name at all.

#### Breaking change

- Due to the discovery of some bugs, the ability to change names is not available in this release.

### Server

#### v0.2.2

- Add more truths and dares (Now is up to 527)

#### v0.2.3

- More random truths and dares will be picked.

#### v0.2.4

- Support for new message style (pushing display name instead of player id).
- Support for user typing broadcast.
- Display of system message for truths and dares picked

## Version 0.2.1

In this coming versions, I have fixed a lot of bugs and improved user experience. The addition of selecting any emojis gives users more fun and interactivity 😀.

**NOTE!** The current version of the game is 0.2.1, but we may change the version to 1.0.0 in the future if we feel that the game is stable enough for a full release. If this happens, we will provide an updated changelog or release notes to reflect the version change.

### What's new (Client - v0.2.1)

- Changed color of re-join game dialog
- Now, when joining a room, you can read the previous messages left.
  - This is to help players who re-join and are given no context to the chat

### What's new (Server - v0.2.1)

- Proper destroying and deletion of games
- Add support for chat
  - Some system message and all user messages is saved to database

## Version 0.2.0

In this coming versions, I have fixed a lot of bugs and improved user experience. The addition of selecting any emojis gives users more fun and interactivity 😀.

**NOTE!** The current version of the game is 0.2.0, but we may change the version to 1.0.0 in the future if we feel that the game is stable enough for a full release. If this happens, we will provide an updated changelog or release notes to reflect the version change.

### What's new (Client - v0.2.0)

- Added terms of service and privacy policy to outline the rights of users and our rights.
- Disabled the censoring of messages in chat. This is because it is the user's responsibility to exercise caution.
- Allows you to pick your own emojis to react to.
- Now the Emoji bar shows your most frequently used emojis.
- **[DEV]** Now the socket provider wraps the game page and inner components can use the socket.
  - This decreases the amount of socket connection tremendously.
- Changed the "Force Skip" button color.
- Fixed: Disable the "Force Skip" button if there is only 1 player in the room.
- There is a system message whenever a player changes their name.
- Changed room code input and also anywhere that shows the room code to be a monospace font.
  - This is so that it is easier for users to read.
- Limit the room code input to only 6 characters.
- Fixed an issue that users can create/join a room many times by spamming the create/join button. This is now fixed. Everytime you press the button, it will disable the button.
- Fixed: User's text message can overflow the chatbox and requires the user to scroll horizontally. This is now fixed.
- If you accidentally left the game, you can return to the home page, it will ask if you need to re-join.
  - This is to fix the fact that players will re-join the room under a different player.

### What's new (Server - v0.2.0)

- Get room API route
- Support for system message to show when a user change name
- Removed profanity filter
- Bumped version to v0.2.0 match game version to avoid confusion

## Version 0.1.10

### What's New (Client - v0.1.10)

- Fixed an issue where users are able to skip multiple players by constantly clicking on the "Continue" button
- Fixed an issue where users are able to select multiple truths/dares by constantly clicking on the "Truth/Dare" button
- Fixed an issue where users are able to re-roll many times by constantly clicking on the "Truth/Dare" button
- Fixed an issue where the game doesnt correctly reflect if it has started or not (since removing the lobby page)

### What's New (Server v0.1.9)

- Now messages sent will be cleaned, you can say extreme bad words anymore, it will be replaced with an asterisk (\*)

## Version 0.1.9

### What's New (Client - v0.1.9)

- Fix a bug where re-rolling will always re-roll a dare (even though you intially selected truth)

### What's new (Server - v0.1.8)

- More truths and dares (290+ truths and dares)
- **[DEV]** Added a simple way to generate truths and dare with a new library: truth_or_dare_generator.

Thank you for using Troof and we hope you enjoy the new features and improvements.

Keep an eye out for future updates and let us know if you have any feedback or suggestions over at my github @nabilridhwan.

## Version 0.1.8

### What's New (Client - v0.1.8)

- Added a new manual page with instructions on how to play the game
- Changed some wordings in the application to make it easier for users to understand
- Added a new, cool tagline that we're proud of!

## Version 0.1.7

### What's New (Client)

- **[DEV]** Code optimisations for socket.
- Removed the lobby page. Now you'll head straight for the game page when joining!
- Add the option to re-roll a truth/dare (if you can't do the challenge, you can re-roll without skipping your turn)
- **[TESTING]** Added the ability to change your name.
  - The changes will be applied on the next turn.
- New profile picture when in chat (by initials)!
- Changed pastel background buttons to have a matching darker text color (instead of black).
- New Animations
  - Added animation of truths/dares popping into screen.
  - Added animation to the continue button to start pulsing.

### What's New (Server)

- Better logging
- Faster Optimisation for Join Game and Room
- Change name handler
- When getting players in a room, it is now sorted by party leader first

## Version 0.1.6

### What's new

- Now, when you join an ongoing game, you will be redirected to the game page instead of passing through the lobby page.
- Changed colors to be pastel colors.
- Optimized font sizes for mobile displays.
- In the players section, your name wil be bolded.
- Added fancy new icon on the browser tab (new favicon!)
- Changed wording of the index page's notice.
- **[DEV]** Client side version is managed by package.json (same as services)
- Added a new changelog page (this page). You can find the button on the home page 'What's new' button.
- Game page
  - Changed the crown to the left hand side
  - **[DEV]** Removed emoji reaction component in favor of text message. Pass the asEmoji prop to enable the emoji display
- Lobby page changes
  - Slightly new buttons for the lobby page.
  - The room code is now a monospace font for better readability.
  - Better spacing.
  - An animation will now pop up for new players.
  - Changed the icon for Invite Players to be a link
  - Changed the design of the Invite Players button
  - Added the ability for a user to leave a game while in lobby

## Version 0.1.5

### What's new

- Add pleading and heartbroken emoji to reaction bar.
- Reactions now will rain on your screen (not joking!). Now you can express your heartfelt emotions and reactions.
- The texts inside the Chat box are now smaller, this includes emojis and text.
- When disconnected, you'll see a system message in the Chat Box telling you that you're disconnected. The page will automatically refresh in 3 seconds in which it will attempt to reconnect.
- Fixed the text inside the "Continue" button is a little light.
- Fixed system messages texts are not centered.
- Add disclaimer to the home page regarding about the extreme truths and dares.
- Add a footer to the home page.
- Add an animated of the bar from going to the left to the right when clicking on 'Join' or 'Create'.
- Fixed the "Troof" title in the home page animation will push elements down - now it no longer does.
- **[NEW]** New layout for desktops.
- **[NEW]** Attempt to have fully randomized questions this time with the chances of getting the same questions lower than usual
- **[NEW]** This is an attempt to change all backend services API to a different more production ready domain.

#### Known Issues

- Some Dares have part of their sentence showing up.
  - **[UPDATE]** This will be part of the roadmap, and will be pushed all the way to the back!
- If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
  - A workaround is for the Party Leader to remove them from the game.
- Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message" [WIP!]

### Roadmap

- Allow people to change their names.
- Different people/name with have different colors.
- No repetitive question [TESTING]

## Version 0.1.4

### What's new

- Fixed a bug where someone can join/create a room with empty names
- Fixed some layout issues to make it responsive on typical mobile devices
- There are _more_ new system messages that will appear in the chatbox (This will facilitate mobile users)
  - When a player's selects a truth/dare
  - When it's the next player's turn
- Improved the messages bubbles design
- Now you can send your pure heartfelt reaction using the new Reaction bar!
- Renamed the "Force Continue" button to "Force Skip" and moved it as part of the players section.
- Improved layout on laptops.
- Added a new 'Server' version in the home page. This tells users if they're playing on up-to-date servers which supports all the new features. The server and game version should be the game.

### Known Issues

- Some Dares have part of their sentence showing up.
  - **[UPDATE]** This will be part of the roadmap, and will be pushed all the way to the back!
- If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
  - A workaround is for the Party Leader to click on the "force continue" button.
- Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message" [WIP!]

## Version 0.1.3

### What's new

- When a player joins or leaves the server, the server will now send a message to everybody's chat.
- Added a new section to see the current players active in the game. This is a work in progress and will be improved in the future.
  - The Party Leader can kick players from the game.
- The force button is now shown every time (it will only work if you are the Party Leader.)
- Proper error message when trying to join a game that doesn't exist or among other errors.
- Clicking on the Room Code in-game will copy the room code only to your clipboard.
- You can now send a person to join a game by clicking on the "Invite" button in the lobby. This will copy the link to your clipboard (in the form of `https://troof.nabilridhwan.com/join/55NKJ4`).
  - If the user is already in the game, they will be redirected to the game.
  - If the user is not in the game, they will to enter their display name and then be redirected to the game.
- Fixed an issue where chat messages were being sent to all games.

### Known Issues

- Some Dares have part of their sentence showing up.
  - **[UPDATE]** This will be part of the roadmap, and will be pushed all the way to the back!
- If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
  - A workaround is for the Party Leader to click on the "force continue" button.
- Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message" [WIP!]

### Roadmap

- Cleanup of games that are already destroyed.
- Better Truths and Dare cards

## Version 0.1.2

### What's new

- Added the very new beta version of the chat. It's not finished yet, but you can try it out. It does send basic messages.

### Known Issues

- Some Dares have part of their sentence showing up.
- If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
  - A workaround is for the Party Leader to click on the "force continue" button.
- Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message"

### Roadmap

- Add Chat functionality to chat among your friends [WIP!]
- Cleanup of games that are already destroyed.
- Add "Copied" upon clicking on the Room Code
- "Force Continue" button should be there at all times
- Allow Party Leader to have the power to remove users from the game

## Version 0.1.1

### What's new

- Fixed the WebSocket Server emitting to all sockets the moment a player selects a truth/dare. This means that when player A & B plays together and A selects a dare. A separate game containing players C & D would show player's A dare.
- Better positioning of the "Leave" and Room code information
- Improved the home page so you can select whether to Create or Join a Room
- Better user interface in the game page.
- Players can now leave the game properly
  - If the current player's turn leaves, the turn will be passed on to the next player.
  - If the current player leaves and they're the party leader. The role will be passed to the next player.
- Players can't join a game that is over.

### Known Issues

- Some Dares have part of their sentence showing up.
- If a player disconnects (not from pressing the "leave" button), the game will stil consider them as disconnected.
  - A workaround is for the Party Leader to click on the "force continue" button.
- Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message"

### Roadmap

- Add Chat functionality to chat among your friends
- Cleanup of games that are already destroyed.
- Add "Copied" upon clicking on the Room Code
- "Force Continue" button should be there at all times
- Allow Party Leader to have the power to remove users from the game
