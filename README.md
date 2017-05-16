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
