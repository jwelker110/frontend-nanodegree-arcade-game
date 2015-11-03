Front End Nanodegree Arcade Game
===============================
The current implementation can be seen in action [here](http://jwelker110.github.io/frontend-nanodegree-arcade-game/#).
### Purpose
This project was created to teach the usefulness and implementation of JavaScript classes while utilizing the given art assets and game engine.

### Details
A generic Sprite class is implemented that provides simple properties common of a canvas sprite. All sprites utilize their own class, while subclassing the Sprite class. The game itself is initialized given a level object that is stored in an array. When the user has completed a level, the canvas is cleared until the user chooses to move on to the next level.

### User-defined levels
User defined levels are possible and allow the user to edit attributes such as enemy count, gem count, and possible rock and win block layout combinations. Simply [download this repo](https://github.com/jwelker110/frontend-nanodegree-arcade-game/archive/master.zip), unzip, and navigate to the js folder. Find app.js and open with a text editor. The levels variable will be one of the first lines of text in the file. Replace the values you see there with your own. For example, where you see "maxGems": 1, you should replace the "1" with a number greater than 0, and less than 16.

After making the desired changes, navigate to the index.html file in your browser to see them in action!

### More information
For more information detailing the requirements and expectations of this project, you can check the course listing at [Udacity](https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3101888637). This provides a more in-depth look at the circumstances leading up to and surrounding this project.
