var xArray = [-100, 0, 100, 200, 300, 400];
var yArray = [-25, 60, 145, 230, 315, 400, 475];
var playerSprite = 'images/char-boy.png';
var enemySprite = 'images/enemy-bug.png';
var rockSprite = 'images/Rock.png';
var gemSprite = 'images/Gem Blue.png';
var rareGemSprite = 'images/Gem Green.png';
var winSprite = 'images/Selector.png';
var score = 0;
var levelWon = false;


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
Sound.prototype.stopAll = function() {
    for (s in this) {
        if (this[s] != null) {
            this[s].loop = false;
            this[s].muted = true;
        }
    }
};

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
    if ( !levelWon ) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Gem class so player can grab the gem!
var Gem = function(gemSprite, xIndex, yIndex) {
    Sprite.call(this, gemSprite, xIndex, yIndex);
    this.visible = true;
}
Gem.prototype = Object.create(Sprite.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.render = function() {
    // draws in middle of block
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite), this.x + 26, this.y - 25, 50, 75);
    }
};
Gem.prototype.update = function() {
    if ( !this.visible ) {
        return;
    }
    var playerX = player.x + 101 / 2;
    var playerY = player.y + 150 - 60;
    if ((playerX >= this.x && playerX <= this.x + 101) && (playerY >= this.y && playerY <= this.y + 60)) {
        soundboard.correct.play();
        this.visible = false;
    }
};

// Rock class. Represents impassible blocks
var Rock = function(xIndex, yIndex){
    Sprite.call(this, rockSprite, xIndex, yIndex);
}
Rock.prototype = Object.create(Sprite.prototype);
Rock.prototype.constructor = Rock;

// Star class. Represents the final block the user navigates to in order to finish level
var Star = function(winSprite, xIndex, yIndex) {
    // subclass the gem since they share some properties.
    Sprite.call(this, winSprite, xIndex, yIndex);
    this.visible = false;
}
Star.prototype = Object.create(Gem.prototype);
Star.prototype.constructor = Star;
Star.prototype.render = function() {
    if (this.visible) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y-100);
    }
}
Star.prototype.update = function() {
    if ( this.captured ) {
        return;
    }
    // checks all the gems and if they are all gone, will become visible
    for (g in allGems) {
        if (allGems[g].visible) {
            return;
        }
    }
    this.visible = true;
    var playerX = player.x + 101 / 2;
    var playerY = player.y + 150 - 60;
    if ((playerX >= this.x && playerX <= this.x + 101) && (playerY >= this.y && playerY <= this.y + 60)) {
        // if the player has stepped on block, mute all sounds, play final sound, clear the canvas.
        var canvas = document.getElementsByTagName('canvas')[0];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        soundboard.stopAll();
        soundboard.win.muted = false;
        soundboard.win.play();
        this.visible = false;
        this.captured = true;
        levelWon = true;
    }
};

// Enemy class
var Enemy = function(xIndex, yIndex) {
    Sprite.call(this, enemySprite, xIndex, yIndex);
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
    // width of bug/character is 101 and bottom is at y + 150
    // top of char-boy.png is located at boy.y + 60
     var playerX = player.x + 101 / 2;
     var playerY = player.y + 150 - 60;
     if ((playerX >= this.x && playerX <= this.x + 101) && (playerY >= this.y + 60 && playerY <=this.y + 150)) {
          soundboard.fail.play();
          player.reset();
     }

};


// Player class
var Player = function(xIndex, yIndex){
    Sprite.call(this, playerSprite, xIndex, yIndex);
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

// vars to get the game setup
var pos, star, player, intervalID;
// vars that can be customized
// maxGems = Maximum # of gems on the board. No more than 15
// randomStarPos = Array of x coords of the ending star block. If the 
//                 star block is on top of a rock, it won't be accessible
// enemyMax = Maximum # of enemies on the board
// rockCoords = Array of rock coordinate arrays
var maxGems, randomStarPos, enemyMax, rockCoords, multiplier;
// place gems in array
var allGems;
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies;
var enemyCount = 0;
// Rock details
var allRocks;

var soundboard = new Sound();

var levels = [{
    "randomStarPos": [1, 3, 5],
    "enemyMax": 3,
    "rockCoords": [
        [2, 0],
        [4, 0],
        [2, 4],
        [2, 5],
        [4, 4],
        [4, 5]],
    "maxGems": 1,
    "multiplier": 150 // speed the bugs move
}];
var levelCount = levels.length;
var currentLevel = 0;
var levelDisplay = document.getElementById("level");

initializeGame(levels[currentLevel]);

/*
 * Listeners
 */

// mute button and progress button
var mute = document.getElementById("mute");
mute.addEventListener('click', function(e) {
    soundboard.toggleMute();
});

var next = document.getElementById("next");
next.addEventListener('click', function(e) {
    // reset the game, or move to the next level
    currentLevel++;
    currentLevel %= levelCount;
    initializeGame(levels[currentLevel]);
});

// This listens for key presses and sends to 
// Player handleInput method
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

/*
 * Functions
 */

/*
 * Get the game set up and initialize vars
 * for a custom level, pass in level object 
 * similar to the above.
 */
function initializeGame(level) {
    levelDisplay.innerHTML = "Level: " + (currentLevel+1) + "/" + levelCount;
    // initialize the game
    allGems = [];
    allEnemies = [];
    allRocks = [];
    // initialize these with the passed in values
    maxGems = level.maxGems;
    randomStarPos = level.randomStarPos;
    enemyMax = level.enemyMax;
    rockCoords = level.rockCoords;
    levelWon = false;
    multiplier = level.multiplier;

    soundboard.music.muted = false;
    soundboard.block.muted = false;
    soundboard.move.muted = false;
    soundboard.correct.muted = false;
    soundboard.fail.muted = false;
    soundboard.win.muted = false;
    soundboard.music.play();

    // set up the gems on the stage
    if (maxGems > 15) {
        maxGems = 15;
    }
    for (var i = 0; i < maxGems; i++) {
        var x = (Math.ceil((Math.random() * 100) % 4)) + 1;
        var y = (Math.ceil((Math.random() * 100) % 3)) + 1;
        allGems.push(new Gem(gemSprite, x, y));
    }

    // This is so that the user can have a random finishing location
    pos = Math.floor((Math.random() * 100) % 2);
    star = new Star(winSprite, randomStarPos[pos], 1);

    // generates the enemy spawns
    intervalID = setInterval(spawnEnemy, 500);

    // create the player and place them
    player = new Player(3, 5);

    for (c in rockCoords) {
        allRocks.push(new Rock(rockCoords[c][0], rockCoords[c][1]));
    }

}

/*
 * Spawn an enemy on the board
 */
function spawnEnemy() {
    if (enemyMax == 0) {
        clearInterval(intervalID);
        return;
    }
    // allEnemies.push(new Enemy());
    allEnemies.push(new Enemy(0, (Math.ceil(Math.random() * 10) % 3) + 1));
    enemyMax--;
}

/*
 * Check if the given coords are passable
 */
function isPathClear(xIndex, yIndex){
    for (r in allRocks) {
        if (allRocks[r].xIndex == xIndex && allRocks[r].yIndex == yIndex) {
            return false;
        }
    }
    return true;
}










