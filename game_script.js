//Load in the canvas for the game
const gameboard = document.getElementById('gameboard');
const ctx = gameboard.getContext('2d');

//Set the size of the board = size of the canvas
const board_width = gameboard.width = 600;
const board_height = gameboard.height = 600;

//Constructor for Image object
const planeImage = new Image();
planeImage.src = 'sprites/plane_sprites.png';
const background1 = new Image();
background1.src = 'sprites/sprite_commie_blocks_2.png';
const background2 = new Image();
background2.src = 'sprites/sprite_sky_2.png';

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
/*
//Animation of the plane
function animatePlane(){
    ctx.clearRect(0,0,board_width,board_height);
    let AnimPosY = planeAnims[planeState].location[AnimPosX].y;
    //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
    ctx.drawImage(planeImage,spriteWidth * AnimPosX,AnimPosY,spriteWidth,spriteHeight,0,200,200,200);
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


//Background layers animated
let backgroundPos1 = 0;
let backgroundPos2 = 0;

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