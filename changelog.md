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
