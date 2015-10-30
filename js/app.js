var xArray = [0, 100, 200, 300, 400];
var yArray = [-10, 60, 145, 230, 315, 400];

// Enemies our player must avoid
var Enemy = function(yIndex) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -100;
    this.y = yArray[yIndex];
    this.speed = (Math.random() * 100) + 150;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = ((this.x + 100 + (this.speed * dt)) % 605) - 100;
    // calculate whether the bug is touching the player

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.x = 200;
    this.yIndex = 5;
    this.y = yArray[this.yIndex];

    this.sprite = 'images/char-boy.png';
};
Player.prototype = Object.create(Enemy.prototype);
Player.prototype.constructor = Object.create(Player);;
Player.prototype.update = function(){
    
}

Player.prototype.handleInput = function(direction, sound, soundFail){
    // sound is the sound to be triggered on movement
    // soundFail is the sound to be triggered when movement isn't possible
    if (direction == 'left' && this.x > 0) {
        sound.play();
        this.x -= 100;
    } else if (direction == 'right' && this.x < 400) {
        sound.play();
        this.x += 100;
    } else if (direction == 'up' && this.yIndex > 0) {
        sound.play();
        this.yIndex -= 1;
        this.y = yArray[this.yIndex];
    } else if (direction == 'down' && this.yIndex < 5) {
        sound.play();
        this.yIndex += 1;
        this.y = yArray[this.yIndex];
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyCount = 0;
var enemyMax = 3;
var intervalID = setInterval(spawnEnemy, 500);

function spawnEnemy() {
    if (enemyCount == enemyMax) {
        clearInterval(intervalID);
        return;
    }
    allEnemies.push(new Enemy((Math.ceil(Math.random() * 10) % 3) + 1));
    enemyCount++;
}

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode], sound.move);
});

var sound = {};
// start the music and loop continuously
sound.music = document.getElementById("music");
sound.move = document.getElementById("move");
sound.correct = document.getElementById("correct");
sound.toggleMute = function() {
    // mutes every sound on the sound object
    for (s in this) {
        this[s].muted = this[s].muted ? false : true;
    }
}

var mute = document.getElementById("mute");
mute.addEventListener('click', function(e) {
    sound.toggleMute();
});
