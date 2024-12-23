//Load in the canvas for the game
const gameboard = document.getElementById('gameboard');
const ctx = gameboard.getContext('2d');

//Set the size of the board = size of the canvas
const board_width = gameboard.width = 600;
const board_height = gameboard.height = 600;

//Constructor for Image object
const PlaneImage = new Image();
PlaneImage.src = 'sprites/plane_sprites.png';

const spriteWidth = 600;
const spriteHeight = 600;

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
console.log(animsStates);
console.log(planeAnims);



let gameFrame = 0;
const slowDownIdle = 5;
const slowDownMotion =8;

let AnimPosX = 0;
function animatePlane(){

    let AnimPosY = planeAnims['idle'].location[AnimPosX].y;
    ctx.clearRect(0,0,board_width,board_height);
    //Src image, coordinates for cutting, size of the cut, placement of the image, size of the image
    ctx.drawImage(PlaneImage,spriteWidth * AnimPosX,AnimPosY,spriteWidth,spriteHeight,0,200,200,200);
    requestAnimationFrame(animatePlane);
    if(gameFrame % slowDownMotion ==0 ){
        if(AnimPosX < planeAnims['idle'].location.length -1){
            AnimPosX++;
        }else{
            AnimPosX=0;
        }
    }
    gameFrame++;
    //console.log(AnimPosX,AnimPosY);
}
animatePlane();
