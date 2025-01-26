Mig-15 Fangpage
Save the planet!
The enemy returned and is stronger and more dangerous than ever.
Your task is simple, as a heroic pilot of the newest technological miracle - jetplane Mig-15. You have to protect your family, country and the most important of all the goverment.
Good luck!

This is a simple page featuring endless side scrolling game with increasingly numerous enemies.
There are three tabs in total 1)the game itself, 2)highscores 3)a little about the game

Features:
  - Player character (the plane) that can move up/down, left/right with arrow keys and shoot with left mouse button.
  - The plane has various animations for different directions of movement.
  - Endlessly scrolling background made of two layers. Each of them going at different speed in opposite directions.
  - Game spawns enemies(nazi UFOS) in waves, with randomized values to give more variety
  - Enemy speed on X axis, wobble on Y axis, and speed of the animation is also randomized
  - Enemies are spawned right side of the canvas, when they pass the left side of the canvas they are recycled
  - Player can shoot down enemies to gain score, enemies have certain amount of lives, when lives reach 0 they are permanently deleted
  - Game animates explosions from players guns, then checks the positions of all the enemies to learn if enemies are hit
  - Enemies are spawned in time interval, witch each new wave spawned this interval shortens
  - The spawned enemy number increases over the time, making the game harder and harder 
  - Player also gets points for time survived
  - When player collides with enemy game ends (game detects collision radius around all the enemies and the player)
  - When the game ends player writes their nickname into a text field
  - Script checks if the new score is one of the ten highest achieved and if yes stores it
  - Ten highest scores are then displayed in the scores tab
  
Technologies used:
  - HTML, CSS, JS - for the webpage, styling and script
  - Software used - MS Paint (graphic), VS Code (code), GitHub, GitBash (version control and managament)
  - All the sprite graphic was made by me, in a retro pixelart style.  
  - Assets include several spritesheets with player movement, enemy movement, explosions and background movement
  - The game cycles quickly between coordinates of these spritesheets -> displaying one image at a time -> creating  smooth animation 

The game itself is coded in OOP approach. JavaScript was used to code all of the game scripts and logic. The main script file is game_script.js

About:
Class Plane: 
  - takes control of player movement, display, animations and collision
  - Methods: drawPlane, movePlane, planeCrash
  - all the possible coordinates of the plane animations are stored in an array
Class Background:
  - controls endlessly scrolling background. Two images are displayed, drawn and reset (partially out of the canvas) so the background movement is always smooth
  -  Method: drawBackground
Class KeyboardImput:
  - listens to player input and passes the up,down,left,right, keyup to the Plane Class.
  - listens to mouse click and adds explosions (they are stored in an array)
  - passes the explosions array to the Enemy class where collision is examined
Class Enemy:
  - creates new enemy instances (stored in an array)
  - randomizes spawns of these instances off the canvas on X and Y axis
  - randomizes movement speed, spin speed and wobble to give more variety
  - draws and animates the enemies on canvas
  - examines enemy positions and exlosion collisions, if there is a match lives get substracted from enemies
  - if there are no lives left, enemies are despawned (removed from the array)
  - Methods: drawEnemy,moveEnemy,checkBoomBoomb
Class Score:
  - Displays and adds to the total score
  - Methods: displayScore, updateScore
Class Explosion:
  - Method: drawExplosion
  - draws the explosions from the array 
Game continuously animates everything, controls movement, shows explosions. When player finally collides with the enemy, animation stops and game over screen is displayed.
At the end of each game, localstorage is used to store and display 10 Highest scores
