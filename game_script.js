//Load in the canvas for the game
const gameboard = document.getElementById('gameboard');
const ctx = gameboard.getContext('2d');

//Set the size of the board = size of the canvas
const board_width = gameboard.width = 600;
const board_height = gameboard.height = 600;

//Constructor for Image object
const plane = new Image();
plane.src = 'sprites/plane_sprites_transparent.png';
const background1 = new Image();
background1.src = 'sprites/sprite_commie_blocks_2.png';
const background2 = new Image();
background2.src = 'sprites/sprite_sky_2.png';
const saucer = new Image();
saucer.src = 'sprites/sprite_saucer_move_transparent.png';

//Default size of the sprites
const spriteWidth = 600;
const spriteHeight = 600;

let gameFrame = 0;
const slowDown = 8;
let AnimPosX = 0;
let planeState = 'moveUp';

const planeAnims = [];

const animsStates = [{
    name: 'idle', frames: 6,
},
{
    name: 'moveUp', frames: 5,
}];

//Fil the array with all the posible coordinates for the sprites
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

const Enemies = [];
const enemyNumber = 3;

class Enemy {
    constructor(){
        //Spawn the enemy off the canvas, slowly move into the frame X coordinate 600+, Y coordinate 0 - 600
        //Math.random() * (max value - min value) + min value;
        this.positionX = Math.random() * ((board_width + 100) - board_width) + board_width;
        this.positionY = Math.random() * ((board_height - 30) - 30) + 30; 
        this.AnimPosX = 0;
        this.AnimPosY = 0;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.slowDown = Math.floor(Math.random() * 5 + 1);
        this.speed = Math.random() * (1 - 0.1) + 0.1;
        //this.type = Math.random() * 2 + 1
        this.type = 1;
    }
    //Taking care of the sprite animation first
    drawEnemy(){
        //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
        ctx.drawImage(saucer,spriteWidth * this.AnimPosX, this.AnimPosY, spriteWidth, spriteHeight, this.positionX ,this.positionY, this.spriteHeight, this.spriteWidth);
        //console.log(this.AnimPosX,this.AnimPosY,this.positionX,this.positionY,this.spriteWidth,this.spriteHeight);
        if(gameFrame % this.slowDown === 0){
            if(this.AnimPosX == 2){
                this.AnimPosX = 0;
            }else{
                this.AnimPosX += 1;
            }
        }     
        gameFrame++;
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
                // Some other kind of movement here
                case 2:

                    break;
                    // Maybe here as well .. who knows?
                    case 3:
                        break;
        }  
    }
}

//Fill array with enemy instances

for(let i = 0; i < enemyNumber;i++){
 Enemies.push(new Enemy());  
}
console.log(Enemies);

function animateEnemy() {
    ctx.clearRect(0,0,board_width,board_height);
    Enemies.forEach(enemy =>{
        enemy.drawEnemy();
        enemy.moveEnemy();
    });
    requestAnimationFrame(animateEnemy);
}
animateEnemy();



//Background layers animated
let backgroundPos1 = 0;
let backgroundPos2 = 0;
/*
function animateBackground(){
    ctx.clearRect(0,0,board_width,board_height);
    ctx.drawImage(background2,backgroundPos2,0);
    ctx.drawImage(background2,backgroundPos2-spriteWidth,0);
    if(backgroundPos2 >= 600){
        backgroundPos2 =0;
    }else{
        backgroundPos2 +=0.1;
        //console.log(backgroundPos2);
    }
    ctx.drawImage(background1,backgroundPos1,300);
    ctx.drawImage(background1,backgroundPos1+spriteWidth,300);
    if(backgroundPos1 == -600){
        backgroundPos1 = 0;
    }else{
        backgroundPos1 -= 1.5;
    }
    requestAnimationFrame(animateBackground);

}
animateBackground();
*/
/*
//Animation of the plane
function animatePlane(){
    ctx.clearRect(0,0,board_width,board_height);
    let AnimPosY = planeAnims[planeState].location[AnimPosX].y;
    //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
    ctx.drawImage(plane,spriteWidth * AnimPosX,AnimPosY,spriteWidth,spriteHeight,0,200,200,200);
    requestAnimationFrame(animatePlane);
    if(gameFrame % slowDown ==0 ){
        if(AnimPosX < planeAnims[planeState].location.length -1){
            AnimPosX++;
        }else{
            AnimPosX=0;
        }
    }
    gameFrame++;
    //console.log(AnimPosX,AnimPosY);
}
animatePlane();
*/
/*
//Animate together
function Animate(){
    ctx.clearRect(0,0,board_width,board_height);
    ctx.drawImage(background2,backgroundPos2,0);
    ctx.drawImage(background2,backgroundPos2-spriteWidth,0);
    if(backgroundPos2 >= 600){
        backgroundPos2 =0;
    }else{
        backgroundPos2 +=0.1;
        //console.log(backgroundPos2);
    }
    ctx.drawImage(background1,backgroundPos1,300);
    ctx.drawImage(background1,backgroundPos1+spriteWidth,300);
    if(backgroundPos1 == -600){
        backgroundPos1 = 0;
    }else{
        backgroundPos1 -= 1.5;
    }

    
    let AnimPosY = planeAnims[planeState].location[AnimPosX].y;
    //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
    ctx.drawImage(plane,spriteWidth * AnimPosX,AnimPosY,spriteWidth,spriteHeight,0,200,200,200);
    requestAnimationFrame(Animate);
    if(gameFrame % slowDown === 0 ){
        if(AnimPosX < planeAnims[planeState].location.length -1){
            AnimPosX++;
        }else{
            AnimPosX=0;
        }
    }
    gameFrame++;
    //console.log(AnimPosX,AnimPosY);
}
Animate();*/

