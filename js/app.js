// Collect stars to score
var Star = function(x, y) {
    this.sprite = 'images/Star.png';
    this.x = x;
    this.y = y;
};

// Disappear a star once player collected it, 
// appear a new star in a random position
Star.prototype.update = function() {
    this.x = starStart().x;
    this.y = starStart().y;
};

// Draw the sar on the screen
Star.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter which will
    // ensure the game runs at the same speed for all computers
    if(this.x >= 707) {
        this.x = -101;
        this.y = bugStartY();
        this.speed = bugSpeed();
    }
    this.x += this.speed * dt;
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Use a random function to choose a bug's speed between 150 and 450
function bugSpeed() {
    return 300 * Math.random() + 150;
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-princess.png';
    this.x = x;
    this.y = y;
};

// Update the player's position
Player.prototype.update = function() {
    /* Nothing need to do in this function
     * Player's position only gets update,
     * when player presses keyboard to move it
     */
};

// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handle user's keyborad input
Player.prototype.handleInput = function(keyboardInput) {
    if(!keyboardInput)
        return;

    // Handle four user input cases
    switch (keyboardInput) {
        case 'left':
            if(this.x <= 0)
                return;
            this.x -= 101;
            break;

        case 'right':
            if(this.x >= 606)
                return;
            this.x += 101;
            break;

        // Get into the water will die
        case 'up':
            this.y -= 83;
            break;

        case 'down':
            // Once player step into the stone area, he can not
            // move back to grass area
            if((onGame && this.y >= 297) ||(!onGame && this.y >= 463))
                return;
            this.y += 83;
            break;
    }
};

// Random select start y position for a bug
function bugStartY() {
    var nY = Math.floor(4 * Math.random());
    return nY * 83 + 63;
}

// Random select start x and y positions for a star
function starStart() {
    var sX = Math.floor(7 * Math.random());
    var sY = Math.floor(4 * Math.random());
    return {
        x: sX * 101,
        y: sY * 83 + 72
    };
}

// Place the player object in a variable called player
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var star = new Star(starStart().x, starStart().y);
var allEnemies = [new Enemy(0, 63, bugSpeed()), new Enemy(202, 146, bugSpeed()), 
                  new Enemy(404, 229, bugSpeed()), new Enemy(606, 312, bugSpeed())];
var player = new Player(303, 380);

// This listens for key presses and sends the keys to
// Player.handleInput() method
document.addEventListener('keyup', function(e) {
    // Only the following four keyboard input values are valid
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
