//Load in the canvas for the game
const gameboard = document.getElementById('gameboard');
const ctx = gameboard.getContext('2d');
//console.log(ctx);

//Set the size of the board = size of the canvas
const board_width = gameboard.width = 600;
const board_height = gameboard.height = 600;

//Constructor for Image object
const idlePlaneImage = new Image();
idlePlaneImage.src = 'sprites/sprite_plane_idle.png';

const spriteWidth = 600;
const spriteHeight = 600;

let idleAnimPos = 0;
let idleAnimNum = 6;

let gameFrame = 0;
const slowDown = 5;

function animatePlaneIdle(){
    
    //clear out the canvas at start
    ctx.clearRect(0,0,board_width,board_height);
    //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
    ctx.drawImage(idlePlaneImage,spriteWidth * idleAnimPos,0,spriteWidth,spriteHeight,0,200,200,200);
    requestAnimationFrame(animatePlaneIdle);
    //Slow down the animation a bit
    if(gameFrame % slowDown==0 ){
        if(idleAnimPos < idleAnimNum-1){
            idleAnimPos++;
        }else{
            idleAnimPos=0;
        }
    }
    gameFrame++;
}
animatePlaneIdle();

