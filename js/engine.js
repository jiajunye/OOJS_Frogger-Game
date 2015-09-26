/* This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in app.js).
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;
        startPage = true;
        gameOverPage = false;
        onGame = false;
        currentScore = 0;
        score = 0;
        best = 0;

    canvas.width = 707;
    canvas.height = 606;
    doc.body.appendChild(canvas);


    // Only press enter from user's keyboard can start and restart the game
    function handleKeyPress(evt) {
        if(startPage && evt === 13) {
            startPage = false;
        }
        if(gameOverPage && evt == 13) {
            gameOverPage = false;
        }
    }

    // This function serves as the kickoff point for the game loop itself
    // and handles properly calling the update and render methods
    function main() {
        /* Get time delta information which is required if the game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is).
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        // Call our update/render functions, pass along the time delta to
        // our update function since it may be used for smooth animation
        update(dt);
        render();

        // Set our lastTime variable which is used to determine the time delta
        // for the next time this function is called
        lastTime = now;

        doc.addEventListener('keyup', function(e) {
            handleKeyPress(e.keyCode);
        });

        // Use the browser's requestAnimationFrame function to call this
        // function again as soon as the browser is able to draw another frame
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        // Call main function
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Then we have
     * checkCollisions function and checkScore functions.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkScore();
    }

    // Loops through all of the enemies and calls their update() methods. 
    // It will then call the update function for player object
    function updateEntities(dt) {
        if(startPage)
            return;
        if(gameOverPage)
            return;
        player.update();
        if(player.y < 380)
            onGame = true;
        if(player.y < 48)
            reset();
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    // Check collision between player and enemy, according to their positions
    // Loops through all of the enemies to complete the checkCollisions function
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            if(enemy.x - 70 < player.x && enemy.x + 70 > player.x 
                && enemy.y - 60 < player.y && enemy.y + 60 > player.y) {
                reset();
            }
        });
    }

    // Check collision between player and star, according to their positions
    // If collided, add one point for player
    function checkScore() {
        if(star.x - 70 < player.x && star.x + 70 > player.x 
            && star.y - 30 < player.y && star.y + 30 > player.y) {
            star.update();
            score++;
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 4 of stone
                'images/stone-block.png',   // Row 2 of 4 of stone
                'images/stone-block.png',   // Row 3 of 4 of stone
                'images/stone-block.png',   // Row 4 of 4 of stone
                'images/grass-block.png',   // Bottom row is grass
            ],
            numRows = 6,
            numCols = 7,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        player.render();

        // Start page. Press enter to start our game
        if(startPage) {
            ctx.fillStyle = "#0404B4";
            ctx.font = "bold 22px Verdana";
            ctx.textAlign = "center";
            ctx.fillText("Press Enter to Start", 350, 265);
            return;
        }

        // Gameover page. Show the score. Press enter to play again
        if(gameOverPage) {
            ctx.fillStyle = "#FF0000";
            ctx.font = "italic bold 34px Courier";
            ctx.textAlign = "center";
            ctx.fillText("Game Over", 353, 170);
            ctx.fillStyle = "#000000";
            ctx.font = "italic bold 22px Courier";
            ctx.textAlign = "center";
            ctx.fillText("Score:" + currentScore, 353, 200);
            ctx.fillStyle = "#0404B4";
            ctx.font = "bold 21px Verdana";
            ctx.textAlign = "center";
            ctx.fillText("Press Enter to Play Again", 353, 265);
            return;
        }

        // Show best score and current score on the canvas
        ctx.fillStyle = "#F0FFF0";
        ctx.font = "italic 20px Verdana";
        ctx.textAlign = "left";
        ctx.fillText("Best:" + best, 106, 577);
        ctx.fillText("Score:" + score, 5, 577);

        // The star position should reset after game over
        star.render();

        // Loop through all of the objects within the allEnemies array and call
        // the render function you have defined
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        gameOverPage = true;
        player.x = 303;
        player.y = 380;
        onGame = false;
        star.update();
        currentScore = score;
        if(score > best)
            best = score;
        score = 0;
    }


    /* Go ahead and load all of the images we're going to need to draw our
     * game level. Then set init as the callback method, so that when all
     * of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-princess.png',
        'images/Star.png'
    ]);
    // Call init function to start the whole game
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that we can use it within our 
     * app.js files more easily.
     */
    global.ctx = ctx;
})(this);
