## Version 0.1.5

### What's new

-   Add pleading and heartbroken emoji to reaction bar.
-   Reactions now will rain on your screen (not joking!). Now you can express your heartfelt emotions and reactions.
-   The texts inside the Chat box are now smaller, this includes emojis and text.
-   When disconnected, you'll see a system message in the Chat Box telling you that you're disconnected. The page will automatically refresh in 3 seconds in which it will attempt to reconnect.
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
