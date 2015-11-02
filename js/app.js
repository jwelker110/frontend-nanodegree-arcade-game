var xArray = [-100, 0, 100, 200, 300, 400];
var yArray = [-10, 60, 145, 230, 315, 400];
var multiplier = 150;

// Base sprite class
var Sprite = function(spriteUrl, xIndex, yIndex) {
    this.xIndex = xIndex;
    this.x = xArray[xIndex];
    this.yIndex = yIndex;
    this.y = yArray[yIndex];
    this.sprite = spriteUrl;
};
Sprite.prototype.update = function(){};
// Draw the enemy on the screen, required method for game
Sprite.prototype.render = function(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy class
var Enemy = function(spriteUrl, xIndex, yIndex) {
    Sprite.call(this, spriteUrl, xIndex, yIndex);
    this.speed = (Math.random() * 100) + multiplier;
};
Enemy.prototype = Object.create(Sprite.prototype);
// reassign constructor so that it doesn't point to Sprite
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = ((this.x + 100 + (this.speed * dt)) % 605) - 100;
    // calculate whether the bug is touching the player
    // top of enemy-bug.png is located at bug.y + 75
    // width of bug/character is 101 and bottom is at x + 150
    // top of char-boy.png is located at boy.y + 60
     var playerX = player.x + 101 / 2;
     var playerY = player.y + 150 - 60;
     if ((playerX >= this.x && playerX <= this.x + 101) && (playerY >= this.y + 60 && playerY <=this.y + 150)) {
          soundboard.fail.play();
          player.reset();
     }

};


// Player class
var Player = function(spriteUrl, xIndex, yIndex){
    Sprite.call(this, spriteUrl, xIndex, yIndex);
    this.initialXIndex = xIndex;
    this.initialYIndex = yIndex;
};
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;
// handle key presses to move the player around
Player.prototype.handleInput = function(direction){
    // sound is the sound to be triggered on movement
    // soundFail is the sound to be triggered when movement isn't possible
    if (direction == 'left' && this.x > 0 && isPathClear(this.xIndex - 1, this.yIndex)) {
        soundboard.move.play();
        this.xIndex -= 1;
        this.x -= 100;
    } else if (direction == 'right' && this.x < 400 && isPathClear(this.xIndex + 1, this.yIndex)) {
        soundboard.move.play();
        this.xIndex += 1;
        this.x += 100;
    } else if (direction == 'up' && this.yIndex > 0 && isPathClear(this.xIndex, this.yIndex - 1)) {
        soundboard.move.play();
        this.yIndex -= 1;
        this.y = yArray[this.yIndex];
    } else if (direction == 'down' && this.yIndex < 5 && isPathClear(this.xIndex, this.yIndex + 1)) {
        soundboard.move.play();
        this.yIndex += 1;
        this.y = yArray[this.yIndex];
    } else if (direction == 'left' || direction == 'right' || direction == 'up' || direction == 'down') {
        soundboard.block.play();
    }
};
// reset the player back to original position
Player.prototype.reset = function() {
     this.xIndex = this.initialXIndex;
     this.x = xArray[this.xIndex];
     this.yIndex = this.initialYIndex;
     this.y = yArray[this.yIndex];
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyCount = 0;
var enemyMax = 3;
var intervalID = setInterval(spawnEnemy, 500);
var laneOne = 0, laneTwo = 0, laneThree = 0;

function spawnEnemy() {
    if (enemyMax == 0) {
        clearInterval(intervalID);
        return;
    }
    // allEnemies.push(new Enemy());
    allEnemies.push(new Enemy('images/enemy-bug.png', 1, (Math.ceil(Math.random() * 10) % 3) + 1));
    enemyMax--;
}

var player = new Player('images/char-boy.png', 3, 5);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// create rock object to place in field
var Rock = function(spriteUrl, xIndex, yIndex){
    Sprite.call(this, spriteUrl, xIndex, yIndex);
}
Rock.prototype = Object.create(Sprite.prototype);
Rock.prototype.constructor = Rock;

var allRocks = [];
allRocks.push(new Rock('images/Rock.png', 2, 5));
allRocks.push(new Rock('images/Rock.png', 4, 5));

function isPathClear(xIndex, yIndex){
    for (r in allRocks) {
        if (allRocks[r].xIndex == xIndex && allRocks[r].yIndex == yIndex) {
            return false;
        }
    }
    return true;
}

// sound class
var Sound = function(){
    // start the music and loop continuously
    this.music = document.getElementById("music");
    this.move = document.getElementById("move");
    this.correct = document.getElementById("correct");
    this.fail = document.getElementById("fail");
    this.win = document.getElementById("win");
    this.block = document.getElementById("block");
}
Sound.prototype.toggleMute = function() {
    // mutes every sound on the sound object
    for (s in this) {
        if (this[s] != null){
            this[s].muted = this[s].muted ? false : true;
        }
    }
};
var soundboard = new Sound();
soundboard.toggleMute();
var mute = document.getElementById("mute");
mute.addEventListener('click', function(e) {
    soundboard.toggleMute();
});
