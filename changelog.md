## Version 0.2.1

In this coming versions, I have fixed a lot of bugs and improved user experience. The addition of selecting any emojis gives users more fun and interactivity 😀.

**NOTE!** The current version of the game is 0.2.1, but we may change the version to 1.0.0 in the future if we feel that the game is stable enough for a full release. If this happens, we will provide an updated changelog or release notes to reflect the version change.

### What's new (Client - v0.2.1)

-   Changed color of re-join game dialog
-   Now, when joining a room, you can read the previous messages left.
    -   This is to help players who re-join and are given no context to the chat

### What's new (Server - v0.2.1)

-   Proper destroying and deletion of games
-   Add support for chat
    -   Some system message and all user messages is saved to database

## Version 0.2.0

In this coming versions, I have fixed a lot of bugs and improved user experience. The addition of selecting any emojis gives users more fun and interactivity 😀.

**NOTE!** The current version of the game is 0.2.0, but we may change the version to 1.0.0 in the future if we feel that the game is stable enough for a full release. If this happens, we will provide an updated changelog or release notes to reflect the version change.

### What's new (Client - v0.2.0)

-   Added terms of service and privacy policy to outline the rights of users and our rights.
-   Disabled the censoring of messages in chat. This is because it is the user's responsibility to exercise caution.
-   Allows you to pick your own emojis to react to.
-   Now the Emoji bar shows your most frequently used emojis.
-   **[DEV]** Now the socket provider wraps the game page and inner components can use the socket.
    -   This decreases the amount of socket connection tremendously.
-   Changed the "Force Skip" button color.
-   Fixed: Disable the "Force Skip" button if there is only 1 player in the room.
-   There is a system message whenever a player changes their name.
-   Changed room code input and also anywhere that shows the room code to be a monospace font.
    -   This is so that it is easier for users to read.
-   Limit the room code input to only 6 characters.
-   Fixed an issue that users can create/join a room many times by spamming the create/join button. This is now fixed. Everytime you press the button, it will disable the button.
-   Fixed: User's text message can overflow the chatbox and requires the user to scroll horizontally. This is now fixed.
-   If you accidentally left the game, you can return to the home page, it will ask if you need to re-join.
    -   This is to fix the fact that players will re-join the room under a different player.

### What's new (Server - v0.2.0)

-   Get room API route
-   Support for system message to show when a user change name
-   Removed profanity filter
-   Bumped version to v0.2.0 match game version to avoid confusion

## Version 0.1.10

### What's New (Client - v0.1.10)

-   Fixed an issue where users are able to skip multiple players by constantly clicking on the "Continue" button
-   Fixed an issue where users are able to select multiple truths/dares by constantly clicking on the "Truth/Dare" button
-   Fixed an issue where users are able to re-roll many times by constantly clicking on the "Truth/Dare" button
-   Fixed an issue where the game doesnt correctly reflect if it has started or not (since removing the lobby page)

### What's New (Server v0.1.9)

-   Now messages sent will be cleaned, you can say extreme bad words anymore, it will be replaced with an asterisk (\*)

## Version 0.1.9

### What's New (Client - v0.1.9)

-   Fix a bug where re-rolling will always re-roll a dare (even though you intially selected truth)

### What's new (Server - v0.1.8)

-   More truths and dares (290+ truths and dares)
-   **[DEV]** Added a simple way to generate truths and dare with a new library: truth_or_dare_generator.

Thank you for using Troof and we hope you enjoy the new features and improvements.

Keep an eye out for future updates and let us know if you have any feedback or suggestions over at my github @nabilridhwan.

## Version 0.1.8

### What's New (Client - v0.1.8)

-   Added a new manual page with instructions on how to play the game
-   Changed some wordings in the application to make it easier for users to understand
-   Added a new, cool tagline that we're proud of!

## Version 0.1.7

### What's New (Client)

-   **[DEV]** Code optimisations for socket.
-   Removed the lobby page. Now you'll head straight for the game page when joining!
-   Add the option to re-roll a truth/dare (if you can't do the challenge, you can re-roll without skipping your turn)
-   **[TESTING]** Added the ability to change your name.
    -   The changes will be applied on the next turn.
-   New profile picture when in chat (by initials)!
-   Changed pastel background buttons to have a matching darker text color (instead of black).
-   New Animations
    -   Added animation of truths/dares popping into screen.
    -   Added animation to the continue button to start pulsing.

### What's New (Server)

-   Better logging
-   Faster Optimisation for Join Game and Room
-   Change name handler
-   When getting players in a room, it is now sorted by party leader first

## Version 0.1.6

### What's new

-   Now, when you join an ongoing game, you will be redirected to the game page instead of passing through the lobby page.
-   Changed colors to be pastel colors.
-   Optimized font sizes for mobile displays.
-   In the players section, your name wil be bolded.
-   Added fancy new icon on the browser tab (new favicon!)
-   Changed wording of the index page's notice.
-   **[DEV]** Client side version is managed by package.json (same as services)
-   Added a new changelog page (this page). You can find the button on the home page 'What's new' button.
-   Game page
    -   Changed the crown to the left hand side
    -   **[DEV]** Removed emoji reaction component in favor of text message. Pass the asEmoji prop to enable the emoji display
-   Lobby page changes
    -   Slightly new buttons for the lobby page.
    -   The room code is now a monospace font for better readability.
    -   Better spacing.
    -   An animation will now pop up for new players.
    -   Changed the icon for Invite Players to be a link
    -   Changed the design of the Invite Players button
    -   Added the ability for a user to leave a game while in lobby

## Version 0.1.5

### What's new

-   Add pleading and heartbroken emoji to reaction bar.
-   Reactions now will rain on your screen (not joking!). Now you can express your heartfelt emotions and reactions.
-   The texts inside the Chat box are now smaller, this includes emojis and text.
-   When disconnected, you'll see a system message in the Chat Box telling you that you're disconnected. The page will automatically refresh in 3 seconds in which it will attempt to reconnect.
-   Fixed the text inside the "Continue" button is a little light.
-   Fixed system messages texts are not centered.
-   Add disclaimer to the home page regarding about the extreme truths and dares.
-   Add a footer to the home page.
-   Add an animated of the bar from going to the left to the right when clicking on 'Join' or 'Create'.
-   Fixed the "Troof" title in the home page animation will push elements down - now it no longer does.
-   **[NEW]** New layout for desktops.
-   **[NEW]** Attempt to have fully randomized questions this time with the chances of getting the same questions lower than usual
-   **[NEW]** This is an attempt to change all backend services API to a different more production ready domain.

#### Known Issues

-   Some Dares have part of their sentence showing up.
    -   **[UPDATE]** This will be part of the roadmap, and will be pushed all the way to the back!
-   If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
    -   A workaround is for the Party Leader to remove them from the game.
-   Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message" [WIP!]

### Roadmap

-   Allow people to change their names.
-   Different people/name with have different colors.
-   No repetitive question [TESTING]

## Version 0.1.4

### What's new

-   Fixed a bug where someone can join/create a room with empty names
-   Fixed some layout issues to make it responsive on typical mobile devices
-   There are _more_ new system messages that will appear in the chatbox (This will facilitate mobile users)
    -   When a player's selects a truth/dare
    -   When it's the next player's turn
-   Improved the messages bubbles design
-   Now you can send your pure heartfelt reaction using the new Reaction bar!
-   Renamed the "Force Continue" button to "Force Skip" and moved it as part of the players section.
-   Improved layout on laptops.
-   Added a new 'Server' version in the home page. This tells users if they're playing on up-to-date servers which supports all the new features. The server and game version should be the game.

### Known Issues

-   Some Dares have part of their sentence showing up.
    -   **[UPDATE]** This will be part of the roadmap, and will be pushed all the way to the back!
-   If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
    -   A workaround is for the Party Leader to click on the "force continue" button.
-   Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message" [WIP!]

## Version 0.1.3

### What's new

-   When a player joins or leaves the server, the server will now send a message to everybody's chat.
-   Added a new section to see the current players active in the game. This is a work in progress and will be improved in the future.
    -   The Party Leader can kick players from the game.
-   The force button is now shown every time (it will only work if you are the Party Leader.)
-   Proper error message when trying to join a game that doesn't exist or among other errors.
-   Clicking on the Room Code in-game will copy the room code only to your clipboard.
-   You can now send a person to join a game by clicking on the "Invite" button in the lobby. This will copy the link to your clipboard (in the form of `https://troof.nabilridhwan.com/join/55NKJ4`).
    -   If the user is already in the game, they will be redirected to the game.
    -   If the user is not in the game, they will to enter their display name and then be redirected to the game.
-   Fixed an issue where chat messages were being sent to all games.

### Known Issues

-   Some Dares have part of their sentence showing up.
    -   **[UPDATE]** This will be part of the roadmap, and will be pushed all the way to the back!
-   If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
    -   A workaround is for the Party Leader to click on the "force continue" button.
-   Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message" [WIP!]

### Roadmap

-   Cleanup of games that are already destroyed.
-   Better Truths and Dare cards

## Version 0.1.2

### What's new

-   Added the very new beta version of the chat. It's not finished yet, but you can try it out. It does send basic messages.

### Known Issues

-   Some Dares have part of their sentence showing up.
-   If a player disconnects (not from pressing the "leave" button), the game will still consider them as connected.
    -   A workaround is for the Party Leader to click on the "force continue" button.
-   Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message"

### Roadmap

-   Add Chat functionality to chat among your friends [WIP!]
-   Cleanup of games that are already destroyed.
-   Add "Copied" upon clicking on the Room Code
-   "Force Continue" button should be there at all times
-   Allow Party Leader to have the power to remove users from the game

## Version 0.1.1

### What's new

-   Fixed the WebSocket Server emitting to all sockets the moment a player selects a truth/dare. This means that when player A & B plays together and A selects a dare. A separate game containing players C & D would show player's A dare.
-   Better positioning of the "Leave" and Room code information
-   Improved the home page so you can select whether to Create or Join a Room
-   Better user interface in the game page.
-   Players can now leave the game properly
    -   If the current player's turn leaves, the turn will be passed on to the next player.
    -   If the current player leaves and they're the party leader. The role will be passed to the next player.
-   Players can't join a game that is over.

### Known Issues

-   Some Dares have part of their sentence showing up.
-   If a player disconnects (not from pressing the "leave" button), the game will stil consider them as disconnected.
    -   A workaround is for the Party Leader to click on the "force continue" button.
-   Users will be redirected to the home page or an error page if their "game" couldnt be found with no obvious error message"

### Roadmap

-   Add Chat functionality to chat among your friends
-   Cleanup of games that are already destroyed.
-   Add "Copied" upon clicking on the Room Code
-   "Force Continue" button should be there at all times
-   Allow Party Leader to have the power to remove users from the game
