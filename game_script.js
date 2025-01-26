window.addEventListener('load',function(){
const gameboard = document.getElementById('gameboard');
const gameOver = document.getElementById('gameover');
const reset = document.getElementById('reset');
const ctx = gameboard.getContext('2d');
const nameField = document.getElementById('name');
const board_width = gameboard.width = 600;
const board_height = gameboard.height = 600;
const scores = JSON.parse(localStorage.getItem("scores")) || [];
const scoreNumber = 10;

const spriteWidth = 600;
const spriteHeight = 600;

let enemyTimer = 200;
let difficulty = 1;
let enemyFrame = 0;
let Enemies = [];
let Explosions = [];
let enemyNumber = 3;

class KeyboardInput{
    constructor(){
        this.key = '';
        this.positionX = 0;
        this.positionY = 0;
        //this.mouse = {positionX: undefined, positionY: undefined};
        window.addEventListener('keydown', down =>{
            if(down.key == 'ArrowUp'   ||
               down.key == 'ArrowDown' ||
               down.key == 'ArrowLeft' ||
               down.key == 'ArrowRight'   )
               {
                    this.key = down.key;
                }
        })
        window.addEventListener('keyup', up =>{
            if(up.key == 'ArrowUp'   ||
               up.key == 'ArrowDown' ||
               up.key == 'ArrowLeft' ||
               up.key == 'ArrowRight'   )
               {
                    this.key = '';
                }
        })  
        window.addEventListener('click', function(clicked){
            const clickPosition = gameboard.getBoundingClientRect();
            this.positionX = clicked.clientX - clickPosition.left;
            this.positionY = clicked.clientY - clickPosition.top
            Explosions.push(new Explosion(this.positionX,this.positionY));
            //this.mouse.positionX = clicked.offsetX;
            //this.mouse.positionY = clicked.offsetY;
            //console.log(clicked) 
        })
    }
}
class Score{
    constructor(){
        this.finalScore = 0;
    }
    displayScore(){
        ctx.font = '50px redOctober';
        ctx.fillStyle = 'Yellow';
        ctx.fillText('Score: ' + this.finalScore, 20, 50);
        ctx.fillStyle = 'Red';
        ctx.fillText('Score: ' + this.finalScore, 23, 53);
    }
    updateScore(Enemies){
        	Enemies.forEach(enemy => {
                if(enemy.destroyed == true){
                    this.finalScore += 1;
                    console.log('Score is: ' + this.finalScore);
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
        this.gameOver = false;

        this.planeAnims = [];

        this.animsStates = [{
            name: 'idle', frames: 6,
        },
        {
            name: 'moveUp', frames: 6,
        },
        {
            name: 'moveDown', frames: 6
        }];

        this.animsStates.forEach((state,index) => {
            let frames = {
                location: [],
            }
            for(let i = 0; i < state.frames; i++){
                let positionX = spriteWidth * i;
                let positionY = spriteHeight * index;
                frames.location.push({x: positionX, y: positionY});
            }
            this.planeAnims[state.name] = frames;
        });

    }
    drawPlane(){
       this.AnimPosY = this.planeAnims[this.planeState].location[this.AnimPosX].y; 
       //ctx.strokeStyle = 'black';
       //ctx.beginPath();
       //ctx.arc(this.planePosX + this.spriteWidth/2,this.planePosY+ this.spriteHeight/2,this.spriteWidth/2,0,Math.PI * 2);
       //ctx.stroke();
       //ctx.strokeRect(this.planePosX,this.planePosY,this.spriteWidth,this.spriteHeight);
       ctx.drawImage(this.plane,spriteWidth * this.AnimPosX,this.AnimPosY,spriteWidth,spriteHeight,this.planePosX,this.planePosY,this.spriteWidth,this.spriteHeight);
        if(this.planeFrame % this.slowDown == 0 ){
            if(this.AnimPosX < this.planeAnims[this.planeState].location.length -1){
                this.AnimPosX++;
            }else{
                this.AnimPosX=0;
            }
        }
        this.planeFrame++;
        }
    movePlane(KeyboardInput){
        if(this.planePosX > board_width - this.spriteWidth){
            this.planePosX = board_width - this.spriteWidth;
        }else if(this.planePosX < 0){
            this.planePosX = 0;
        }else if(this.planePosY > board_height - this.spriteHeight){
            this.planePosY = board_height - this.spriteHeight;
        }else if(this.planePosY < 0){
            this.planePosY = 0;
        }else{
            switch(KeyboardInput.key){
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
    planeCrash(Enemies){
        Enemies.forEach(enemy =>{
            const planeRadius = (this.spriteWidth/2)*0.5;
            const enemyRaidus = (enemy.spriteWidth/2)*0.5;
            const collisionDistance = planeRadius + enemyRaidus;
            const side1 = Math.pow((this.planePosX - enemy.positionX),2);
            const side2 = Math.pow((this.planePosY - enemy.positionY),2);
            const side3 = Math.sqrt(side1 + side2);
            if(collisionDistance > side3){
                this.gameOver = true;
                console.log('Game Over');
            }
        })
    }
}
class Explosion {
    constructor(positionX,positionY){
        this.explosion = new Image();
        this.explosion.src = 'sprites/explosion_sprite_transparent.png';
        this.positionX = positionX;
        this.positionY = positionY;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.explosionFrame = 0;
        this.slowDown = 5;
        this.AnimPosX = 0;
 
    }
    drawExplosion(){
            ctx.drawImage(this.explosion,this.AnimPosX * spriteWidth,0,spriteWidth,spriteHeight,this.positionX-this.spriteWidth/2,this.positionY-this.spriteHeight/2,this.spriteWidth,this.spriteHeight);        
            if(this.explosionFrame % this.slowDown == 0){
                this.AnimPosX +=1;
            }
            this.explosionFrame +=1;     
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
        ctx.drawImage(this.bgSky,this.bgPos2,0);
        ctx.drawImage(this.bgSky,(this.bgPos2-spriteWidth)+1,0);
        if(this.bgPos2 >= spriteWidth){
            this.bgPos2 =0;
        }else{
            this.bgPos2 +=0.1;
        }
        ctx.drawImage(this.bgBlock,this.bgpos1,spriteWidth/2);
        ctx.drawImage(this.bgBlock,this.bgpos1+spriteWidth,spriteWidth/2);
        if(this.bgpos1 == -spriteWidth){
            this.bgpos1 = 0;
        }else{
            this.bgpos1 -= 1.5;
        }
    }
}


class Enemy {
    constructor(){
        this.saucer = new Image();
        this.saucer.src = 'sprites/sprite_saucer_move_transparent.png';
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        //Math.random() * (max value - min value) + min value;
        //Need some tweaking here, saucers are spawning too close to each other!
        this.positionX = Math.random() * 100 + board_width;
        this.positionY = Math.random() * board_height - this.spriteHeight;
        this.AnimPosX = 0;
        this.AnimPosY = 0;
        this.slowDown = Math.floor(Math.random() * 4 + 2);
        this.speed = Math.random() * 2 + 1;
        //Different types of the enemies, for different move patterns, not implemented
        //this.type = Math.random() * 1 + 1
        this.type = 1;
        this.enemyFrame = 0;
        this.destroyed = false;
        this.lives = 20;
    }
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
    }
    moveEnemy(){
        //If the Position of the saucer is behind the edge of the game, reset it back to the start
        switch(this.type) {
            // Horizontal movement right to left
            case 1 :
                if(this.positionX + this.spriteWidth < 0){
                    this.positionX = Math.random() * ((board_width + 100) - board_width) + board_width;
                    this.positionY = Math.random() * ((board_height - 30) - 30) + 30; 
                    this.speed = Math.random() * 2 + 1;
                }else{
                    this.positionY -= Math.round(Math.random()) * 2 - 1;
                    this.positionX -= this.speed;
                }
                break;
                // In case I want to implement another pattern
                case 2:
                    break;
                    
        }  
    }
    checkBoomBoom(Explosions){  
        Explosions.forEach(explosion => {
            if(explosion.positionX > this.positionX && explosion.positionX < this.positionX + this.spriteWidth &&  
                explosion.positionY > this.positionY && explosion.positionY < this.positionY + this.spriteHeight && this.lives == 0){
                    console.log("Enemy destroyed")
                    this.destroyed = true;
                }else if(explosion.positionX > this.positionX && explosion.positionX < this.positionX + this.spriteWidth &&  
                    explosion.positionY > this.positionY && explosion.positionY < this.positionY + this.spriteHeight){
                    this.lives -=1;
                    console.log("Enemy hit")
                }
        })
    }
}

const plane = new Plane();
const input = new KeyboardInput();
const background = new Background ();
const explosion = new Explosion();
const score = new Score();

//Might require some tweaking, but better now
function addEnemies(Score){    
    let enemyRandom = Math.floor(Math.random() * 400 + 100)
    if(enemyFrame > enemyTimer + enemyRandom && difficulty % 5 == 0 ){
            for(let i = 0; i < enemyNumber;i++){
                Enemies.push(new Enemy());  
                console.log('Difficulty ' + difficulty + ' Added new Enemy');
            } 
            enemyTimer -= 10;
            enemyNumber +=1
            enemyFrame = 0;
            difficulty++;
            console.log('EnemyTimer: ' + enemyTimer + ' Number of Enemies: ' + enemyNumber);
            console.log(Enemies);  
            Score.finalScore ++;  

    }else if(enemyFrame > enemyTimer + enemyRandom){
            for(let i = 0; i < enemyNumber;i++){
                Enemies.push(new Enemy());  
                console.log('Difficulty ' + difficulty + ' Added new Enemy');
            } 
            enemyTimer -= 10;
            enemyFrame = 0;
            console.log('EnemyTimer: ' + enemyTimer + ' Number of Enemies: ' + enemyNumber);
            console.log(Enemies); 
            difficulty++;
            Score.finalScore ++;  
    }else{
        enemyFrame++;
    }
}
function Animate(){
    ctx.clearRect(0,0,board_width,board_height);
    background.drawBackground();
    Enemies.forEach(enemy =>{
        enemy.drawEnemy();
        enemy.moveEnemy();
        enemy.checkBoomBoom(Explosions);
    });
    score.updateScore(Enemies);
    Enemies = Enemies.filter(enemy => !enemy.destroyed);

    for(let i = 0; i < Explosions.length;i++){
        Explosions[i].drawExplosion();
        if(Explosions[i].AnimPosX == 3){
            Explosions.splice(Explosions[i],1);
        }
    }
    plane.movePlane(input);
    plane.planeCrash(Enemies);
    plane.drawPlane();
    addEnemies(score);
    score.displayScore();
    if(plane.gameOver == false){
        requestAnimationFrame(Animate);
    }
    else if(plane.gameOver == true){
        gameOver.style.display = 'block';
        reset.addEventListener('click', () => {          
            let lastScore = score.finalScore;
            let lastName = nameField.value;
            const newEntry = {
                name: lastName,
                score: lastScore
            };
            scores.push(newEntry);
            scores.sort((a,b) => b.score - a.score);
            scores.splice(scoreNumber);
            localStorage.setItem('scores', JSON.stringify(scores));
            window.location.reload();
        })
    }
}
Animate();
});