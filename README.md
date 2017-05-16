# socketio-game


## Setup

1. Check the npm packages:

    ```
    npm install
    ```

2. Start the application

    ```
    node dist/api.js
    ```

## Managing the project with Grunt

* Runs eslint, babel:dist and mochaTest

    ```
    grunt
    ```

* Runs the tests (the same as ```npm test```) 

    ```
    grunt mochatest
    ```

* Compiles the .es6 files to .js
 
    ```
    grunt babel:dist
    ```

* Lints the .es6 files

    ```
    grunt eslint
    ```
    
## Testing the SocketIO Game
* To test the App, Healthcheck endpoint
```
http://localhost:8050/v1/healthcheck
https://mysterious-dusk-71044.herokuapp.com/v1/healthcheck
```
* To start the app,
```
http://localhost:8050
https://mysterious-dusk-71044.herokuapp.com/
```
## To test the App follow the steps
*  First **Register** the user
*  **Create Game** -> **Create**
*  Game Creator will be automatically joined to the game but play game button will be disabled till minimum 2 users clicks on the Ready button.
*  **Ready** button is used for sending ready signal
*  **Leave** button is used for leaving the game
*  **Remove** button is visible to creator of the game and creator can remove any joined player before playing the game.
*  **Exit** will exit the complete game
*  **Join** is used for joining the game
*   **Play Game** is visible to creator only. it will be enabled after 2 ready signal. Click on the button to play the game. Game playing is nothing so it will just disable everything.
*   Game will be automatically started when we have 4 ready signal for a game.
*   **Game Over** is used to finish & delist the game

## Scalable Solution
https://github.com/shaktiskm/docs/blob/master/socketio-game.docx

