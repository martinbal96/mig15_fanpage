//Load in the canvas for the game
const gameboard = document.getElementById('gameboard');
const ctx = gameboard.getContext('2d');

//Set the size of the board = size of the canvas
const board_width = gameboard.width = 600;
const board_height = gameboard.height = 600;

//Default size of the sprites
const spriteWidth = 600;
const spriteHeight = 600;

let key = '';
let gameFrame = 0;
let difficulty = 0;

let Enemies = [];
let enemyNumber = 1;

const planeAnims = [];

const animsStates = [{
    name: 'idle', frames: 6,
},
{
    name: 'moveUp', frames: 5,
},
{
    name: 'moveDown', frames: 6
}];

//Fill the array with all the posible coordinates for the sprites
animsStates.forEach((state,index) => {
    let frames = {
        location: [],
    }
    for(let i = 0; i < state.frames; i++){
        let positionX = spriteWidth * i;
        let positionY = spriteHeight * index;
        frames.location.push({x: positionX, y: positionY});
    }
    planeAnims[state.name] = frames;
});
//console.log(animsStates);
//console.log(planeAnims);

class KeyboardInput{
    constructor(){
        window.addEventListener('keydown', down =>{
            if(down.key == 'ArrowUp'   ||
               down.key == 'ArrowDown' ||
               down.key == 'ArrowLeft' ||
               down.key == 'ArrowRight'   )
               {
                    key = down.key;
                    //console.log(key);
                }
        })
        window.addEventListener('keyup', up =>{
            if(up.key == 'ArrowUp'   ||
               up.key == 'ArrowDown' ||
               up.key == 'ArrowLeft' ||
               up.key == 'ArrowRight'   )
               {
                    key = '';
                    //console.log(key);
                }
        })

    }
}

class Plane{
    constructor(){
        this.plane = new Image();
        this.plane.src = 'sprites/plane_sprites_transparent.png';
        this.AnimPosX = 0;
        this.AnimPosY = 0;
        this.planeFrame = 0;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.slowDown = 8;
        this.planeState = 'idle';
        this.planePosX = 0;
        this.planePosY = 200;
    }
    drawPlane(){

        //Sometimes the game cannot read y value anc crashes. It happens only when playing the moveUp animation. When attempting to load for the first time after pressing the up key.
        console.log(planeAnims[this.planeState].location[this.AnimPosX].y);
       this.AnimPosY = planeAnims[this.planeState].location[this.AnimPosX].y; 
       
       ctx.drawImage(this.plane,spriteWidth * this.AnimPosX,this.AnimPosY,spriteWidth,spriteHeight,this.planePosX,this.planePosY,this.spriteWidth,this.spriteHeight);
        if(this.planeFrame % this.slowDown == 0 ){
            if(this.AnimPosX < planeAnims[this.planeState].location.length -1 ){
                this.AnimPosX++;
            }else{
                this.AnimPosX=0;
            }
        }
        this.planeFrame++;
        }
    movePlane(){
        //Check if the plane is not crossing the boundaries of the game frame
        //If yes keep the same position it has
        if(this.planePosX > board_width - this.spriteWidth){
            this.planePosX = board_width - this.spriteWidth;
        }else if(this.planePosX < 0){
            this.planePosX = 0;
        }else if(this.planePosY > board_height - this.spriteHeight){
            this.planePosY = board_height - this.spriteHeight;
        }else if(this.planePosY < 0){
            this.planePosY = 0;
        }else{
            switch(key){
                case 'ArrowUp':
                    this.planePosY-=1.5;
                    this.planeState = 'moveUp';
                    break;
                case 'ArrowDown':
                    this.planePosY+=1.5;
                    this.planeState = 'moveDown';
                    break;
                case 'ArrowLeft':
                    this.planePosX-=1.5;
                    break;
                case 'ArrowRight':
                    this.planePosX+=1.5;
                    break;
                default:
                    this.planeState = 'idle';
            }
        }  
    }
}

class Background {
    constructor(){
        this.bgpos1 = 0;
        this.bgPos2 = 0;
        this.bgBlock = new Image();
        this.bgBlock.src = 'sprites/sprite_commie_blocks_2.png';
        this.bgSky = new Image();
        this.bgSky.src = 'sprites/sprite_sky_2.png';

    }
    drawBackground(){
        //Sky layer of the background
        ctx.drawImage(this.bgSky,this.bgPos2,0);
        ctx.drawImage(this.bgSky,this.bgPos2-spriteWidth,0);
        if(this.bgPos2 >= 600){
            this.bgPos2 =0;
        }else{
            this.bgPos2 +=0.1;
        }
        //Commie blocks layer of the background
        ctx.drawImage(this.bgBlock,this.bgpos1,300);
        ctx.drawImage(this.bgBlock,this.bgpos1+spriteWidth,300);
        if(this.bgpos1 == -600){
            this.bgpos1 = 0;
        }else{
            this.bgpos1 -= 1.5;
        }
    }
    stopBackground(){
        //If the plane crashes. The game stops
    }

}


class Enemy {
    constructor(){
        this.saucer = new Image();
        this.saucer.src = 'sprites/sprite_saucer_move_transparent.png';
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        //Spawn the enemy off the canvas, slowly move into the frame X coordinate 600+, Y coordinate 0 - 600
        //Math.random() * (max value - min value) + min value;
        this.positionX = Math.random() * ((board_width + 100) - board_width) + board_width;
        this.positionY = Math.random() * (board_height - this.spriteHeight) + this.spriteHeight; 
        this.AnimPosX = 0;
        this.AnimPosY = 0;
        //Different speed of the saucer animation
        this.slowDown = Math.floor(Math.random() * 4 + 2);
        //Different speed of the saucer movement
        this.speed = Math.random() * (1 - 0.2) + 0.2;
        //Different types of the enemies, for different move patterns
        //this.type = Math.random() * 1 + 1
        this.type = 1;
        this.enemyFrame = 0;
    }
    //Taking care of the sprite animation first
    drawEnemy(){
        //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
        ctx.drawImage(this.saucer,spriteWidth * this.AnimPosX, this.AnimPosY, spriteWidth, spriteHeight, this.positionX ,this.positionY, this.spriteHeight, this.spriteWidth);
        
        if(this.enemyFrame % this.slowDown == 0){
            if(this.AnimPosX == 2){
                this.AnimPosX = 0;
            }else{
                this.AnimPosX += 1;
            }
        }
        this.enemyFrame++;
        //console.log(this.AnimPosX,this.AnimPosY,this.slowDown,this.positionX,this.positionY);
        
    }
    //Then move the enemy position
    moveEnemy(){
        //If the Position of the saucer is behind the edge of the game, reset it back to the start
        switch(this.type) {
            // Horizontal movement right to left
            case 1 :
                if(this.positionX + this.spriteWidth < 0){
                    this.positionX = Math.random() * ((board_width + 100) - board_width) + board_width;
                    this.positionY = Math.random() * ((board_height - 30) - 30) + 30; 
                    this.speed = Math.random() * (1 - 0.1) + 0.1;
                }else{
                    this.positionY -= Math.round(Math.random()) * 2 - 1;
                    this.positionX -= this.speed;
                }
                break;
                // Maybe here as well .. who knows?
                case 2:
                    break;
                    
        }  
    }
}

// Create class instances
const plane = new Plane();
const input = new KeyboardInput();
const background = new Background ();

//Add more enemies, making the game harder over the time
function addEnemies(gameFrame,difficulty){
    if(gameFrame % difficulty == 0){
        for(let i = 0; i < enemyNumber;i++){
            Enemies.push(new Enemy());  
            console.log('Added new Enemy');
           }
    }
}
/*
// Create new enemy instances + fill the array
for(let i = 0; i < enemyNumber;i++){
 Enemies.push(new Enemy());  
}
//console.log(Enemies);*/
function Animate(){
    ctx.clearRect(0,0,board_width,board_height);
    background.drawBackground();

    //Animate the enemies
    Enemies.forEach(enemy =>{
        enemy.drawEnemy();
        enemy.moveEnemy();
    });
    //Animate and move the plane  
    plane.movePlane();
    plane.drawPlane();
    requestAnimationFrame(Animate);
    gameFrame++;
    difficulty +=1;
    addEnemies(gameFrame,difficulty);

}
Animate();