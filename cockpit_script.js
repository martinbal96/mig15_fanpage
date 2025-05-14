window.addEventListener('load',function(){

const cockpit = document.getElementById('cockpit');
const ctx = cockpit.getContext('2d');
const cockpit_width = cockpit.width = 600;
const cockpit_height = cockpit.height = 600;
const sprite_size = 600;
sky = new Image();
sky.src = 'sprites/sky.png'
const maxEnemies = 3;
let nowEnemies = 0;
let Enemies = [];
let addEnemyFrame = 0;
const engineSound = new Audio();
engineSound.src = 'assets/jetengine.mp3';
engineSound.loop = true;
let isGameOver = false;
const track = new Audio();
track.src = 'assets/track.mp3';
track.loop = true;
let gameStopped = false;


const sharedSounds = {
    boom: new Audio('assets/boom.mp3'),
    ufoengine: new Audio('assets/ufoengine.mp3'),
    par1: new Audio('assets/par1.mp3'),
    laser: new Audio('assets/laser.mp3'),
    insults: [
        new Audio('assets/12min.mp3'),
        new Audio('assets/cult1.mp3'),
        new Audio('assets/cult2.mp3'),
        new Audio('assets/ich.mp3'),
        new Audio('assets/loslos.mp3'),
        new Audio('assets/nein.mp3'),
    ]
};
sharedSounds.ufoengine.loop = true;


class KeyboardInput{
    constructor(){
        this.key = '';
        window.addEventListener('keydown', down =>{
            if(down.key == 'ArrowUp'   ||
               down.key == 'ArrowDown' ||
               down.key == 'ArrowLeft' ||
               down.key == 'ArrowRight' ||
               down.key == 'Enter'  ||
               down.key == 'Escape')
               {
                    this.key = down.key;
                }
        })
        window.addEventListener('keyup', up =>{
            if(up.key == 'ArrowUp'   ||
               up.key == 'ArrowDown' ||
               up.key == 'ArrowLeft' ||
               up.key == 'ArrowRight' ||
               up.key == 'Enter'  )
               {
                    this.key = '';
                }
        }) 
    }
}
class Clouds{
    constructor(){
        this.bgClouds_1 = new Image();
        this.bgClouds_1.src = 'sprites/loop_clouds_1.png';
        this.bgClouds_2 = new Image();
        this.bgClouds_2.src = 'sprites/loop_clouds_2.png';
        this.bgClouds_3 = new Image();
        this.bgClouds_3.src = 'sprites/loop_clouds_3.png';
        this.clouds_width = 30000;
        this.clouds_pos = 0;
        this.bgClouds = this.bgClouds_1;
        this.clouds_slow = 5;
        this.clouds_frame = 0;
    }
    drawClouds(KeyboardInput){
        switch(KeyboardInput.key){
            case 'ArrowUp':
                this.clouds_slow = 2;
                break;
            case 'ArrowDown':
                this.clouds_slow = 5;
                break;
        }
        ctx.drawImage(this.bgClouds,this.clouds_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
        if(this.clouds_frame % this.clouds_slow == 0){
            if(this.clouds_pos == (this.clouds_width-sprite_size) && this.bgClouds == this.bgClouds_1){
                this.clouds_pos = 0;
                this.bgClouds = this.bgClouds_2;
                this.clouds_frame++;
            }else if(this.clouds_pos == (this.clouds_width-sprite_size)  && this.bgClouds == this.bgClouds_2){
                this.clouds_pos = 0;
                this.bgClouds = this.bgClouds_3;
                this.clouds_frame++;

            }else if(this.clouds_pos == (this.clouds_width-sprite_size)  && this.bgClouds == this.bgClouds_3){
                this.clouds_pos = 0;
                this.bgClouds = this.bgClouds_1;
                this.clouds_frame++;
            }
            else{
                this.clouds_pos += 600;
                this.clouds_frame++;
        }}else{
                this.clouds_frame++;
        }
        }
}
class GameOver {
    constructor() {
        this.GameOver1 = new Image();
        this.GameOver1.src = 'sprites/gameover1.png';
        this.GameOver2 = new Image();
        this.GameOver2.src = 'sprites/gameover2.png';
        this.played = false;
        this.GameOver = this.GameOver1;
        this.GameOverSize = 18000;
        this.GameOverPos = 0;
        this.spriteSize = 600;
        this.frame = 0;
        this.slow = 5;
    }

    drawGameOver() {
        if (this.played) return;

        ctx.clearRect(0, 0, cockpit_width, cockpit_height);
        ctx.drawImage(this.GameOver, this.GameOverPos, 0, sprite_size, sprite_size, 0, 0, cockpit_width, cockpit_height);

        if (this.frame % this.slow === 0) {
            this.GameOverPos += sprite_size;

            if (this.GameOverPos >= this.GameOverSize) {
                if (this.GameOver === this.GameOver1) {
                    this.GameOver = this.GameOver2;
                    this.GameOverPos = 0;
                } else {
                    this.played = true;
                }
            }
        }
        this.frame++;
    }
}
class Enemy{
    constructor(sharedSounds){    
        this.enemy = new Image();
        this.sharedSounds = sharedSounds;
        this.sound_boom = sharedSounds.boom;
        this.sound_ufoengine = sharedSounds.ufoengine;
        this.sound_par1 = sharedSounds.par1;
        this.sound_laser = sharedSounds.laser;
        this.insult = 0;
        this.enemy.src = 'sprites/sprite_saucer_move_transparent.png';
        this.enemy_size = 1800;
        this.lives = 40;
        this.destroyed = false;
        this.avoided = false;
        this.inPos = false;
        this.enemy_out = false;
        this.enemy_slow = Math.floor(Math.random() * 4 + 2);
        this.enemy_frame = 0;
        this.enemy_pos = 0;
        this.enemyWidth = 200;
        this.enemyHeight = 200;
        this.enemy_place = '';
        //Math.random() * (max- min) + min;
        this.posX = Math.floor(Math.random() * (cockpit_width - this.enemyWidth) + cockpit_width);
        this.posY = Math.floor(Math.random() * (cockpit_height - this.enemyHeight) + cockpit_height);
        this.goal = Math.floor(Math.random() * 3);
        this.goalX2 = 0;
        this.goalY2 = 0;
        this.Stopped = false;
        switch(this.goal){
            case 0:
                this.goalX = 200;
                this.goalY = 120;
                this.enemy_place = 'center';
                break;
            case 1:
                this.goalX = 40;
                this.goalY = 20;
                this.enemy_place = 'left';
                break;
            case 2:
                this.goalX = 380;
                this.goalY = 20;
                this.enemy_place = 'right';
                break;
        }
    }
    playRandomInsult() {
    const isLeft = this.enemy_place === 'left';

    let index;
    if (isLeft) {
        // "ich", "loslos", "nein" 3, 4, 5
        index = 3 + Math.floor(Math.random() * 3);
    } else {
        // "12min", "cult1", "cult2" 0, 1, 2
        index = Math.floor(Math.random() * 3);
    }

    const audio = this.sharedSounds.insults[index];
    if (audio) {
        audio.currentTime = 0;
        audio.play();
    }
}
    
    enemyShoot(Plane){
        if(this.inPos && this.enemy_frame % 600 == 0){    
            Plane.lives -=1;
            this.sound_laser.play();
            this.parade = Math.floor(Math.random() * 2);
            if(this.parade == 1){
                this.sound_par1.play();
            }
            console.log('Hit!' + Plane.lives);
        }
    }
    drawEnemy(){
        ctx.drawImage(this.enemy,this.enemy_pos, 0, sprite_size, sprite_size, this.posX ,this.posY, this.enemyHeight, this.enemyWidth);
        if(this.enemy_frame % this.enemy_slow == 0){
            if(this.enemy_pos == (this.enemy_size-sprite_size)){
                this.enemy_pos = 0;
            }else{
                this.enemy_pos +=sprite_size;
            }
        }
        this.enemy_frame++;       
    }
    playUfo(){
        if(this.posX < 700 && this.posY < 700 && this.destroyed == false && this.avoided == false){
            this.sound_ufoengine.play();
        }else if(this.destroyed == true || this.avoided == true ){
            this.sound_ufoengine.pause();
        }
    }
    moveEnemyIn(){
        if(this.posX == this.goalX && this.posY == this.goalY){
            this.posX = this.goalX;
            this.posY = this.goalY;
            this.inPos = true;
        }
        else if(this.posX == this.goalX && this.posY != this.goalY){
            this.posY -= 1;
            this.posX = this.goalX;
        }
        else if(this.posX != this.goalX && this.posY == this.goalY){
            this.posX -= 1;
            this.posY = this.goalY;
        }else if(this.posX != this.goalX && this.posY != this.goalY){
            this.posX -=1;
            this.posY -=1; 
        }
    }
    moveEnemyOut(){
        if(this.avoided == true){
            this.goalX2 = 200;
            this.goalY2 = -200;
            if(this.posX == this.goalX2 && this.posY < 0){
                this.posX = this.goalX2;
                this.posY = this.goalY2;
                this.enemy_out = true;
            
            }
            else if(this.posX != this.goalX2 && this.posY != this.goalY2){
                this.posY -=1;
                switch(this.enemy_place){
                    case 'right':
                        this.posX -=1
                        break;
                    case 'left':
                        this.posX +=1;
                        break;
                }
            }else if(this.posX != this.goalX2 && this.posY == this.goalY2){
                switch(this.enemy_place){
                    case 'right':
                        this.posX -=1
                        break;
                    case 'left':
                        this.posX +=1;
                        break;
                }
            }else if(this.posX == this.goalX && this.posY != this.goalY2){
                this.posY -=1;
            }
        }
    }
    avoidEnemy(Plane) {
    if (Plane.dodged && this.inPos) {
        this.avoided = true;
        Plane.dodged = false;
        this.inPos = false;

        this.playRandomInsult(); 
    } else if (Plane.dodged && !this.inPos) {
        Plane.dodged = false;
    }
    }
    stopEnemy(Plane){
        if(Plane.stopEnemies == true){
            this.avoided = true;
        }
    }
    destroyEnemy(Explosion,Plane){
        if(Plane.exploded == true){
            if(Explosion.centerX > this.posX && Explosion.centerX < this.posX + this.enemyWidth &&  
                Explosion.centerY > this.posY && Explosion.centerY < this.posY + this.enemyHeight && this.lives < 0){
                    this.destroyed = true;
                    this.sound_boom.play();
                    nowEnemies -=1;
            }
            else if(Explosion.centerX > this.posX && Explosion.centerX < this.posX + this.enemyWidth &&  
                Explosion.centerY > this.posY && Explosion.centerY < this.posY + this.enemyHeight){
                    if(this.lives < 20 && Explosion.explosion_pos == 0){
                        Explosion.switchExplosion();
                    }
                    this.lives -= 1;
                    console.log(this.lives);
            }
        }
    }
}
class Explosion{
    constructor(){
        this.explosion = new Image();
        this.bullets = new Image();  
        this.explosion.src = 'sprites/explosion_sprite_transparent.png';
        this.bullets.src = 'sprites/bullet_impact.png';
        this.sprite_size_explosion = 2400;
        this.currentState = this.bullets;
        this.explosion_pos = 0;
        this.explosion_width = 300;
        this.explosion_height = 300;
        this.explosion_frame = 0;
        this.explosion_slow = 4;
        this.posX = 140;
        this.posY = 60;
        this.centerX = 300;
        this.centerY = 250;
        
    }
    drawExplosion(Plane){
        if(Plane.exploded == true){
            ctx.drawImage(this.currentState,this.explosion_pos,0,sprite_size,sprite_size,this.posX,this.posY,this.explosion_width,this.explosion_height);
            if(this.explosion_frame % this.explosion_slow == 0){
                if(this.explosion_pos == (this.sprite_size_explosion - sprite_size)){
                    Plane.exploded = false
                    this.explosion_pos = 0;
                    this.switchExplosion2();
                }
                else{
                    this.explosion_pos += sprite_size;
                }
            }
            this.explosion_frame++;
        }
    }
    switchExplosion(){
        this.currentState = this.explosion;
        this.sprite_size_explosion = 1800;
        this.posX = 150;
        this.posY = 100;
    }
    switchExplosion2(){
        this.currentState = this.bullets;
        this.sprite_size_explosion = 2400;
        this.posX = 140;
        this.posY = 60;
    }
}
class Plane{
    constructor(){
        this.state = "idle";
        this.sprite_size_idle = 22800;
        this.sprite_size_rotation = 6000;
        this.sprite_size_speed = 9600;
        this.sprite_size_shoot = 4800;
        this.plane_idle_1 = new Image();
        this.plane_idle_1.src = 'sprites/loop_idle_1.png';
        this.plane_idle_crack_1 = new Image();
        this.plane_idle_crack_1.src = 'sprites/loop_idle_crack_1.png';
        this.plane_idle_crack_2 = new Image();
        this.plane_idle_crack_2.src = 'sprites/loop_idle_crack_2.png';
        this.plane_rotation_right = new Image();
        this.plane_rotation_right.src = 'sprites/loop_rotation_right.png';
        this.plane_idle_2 = new Image();
        this.plane_idle_2.src = 'sprites/loop_idle_2.png';
        this.sound_shoot = new Audio();
        this.sound_shoot.src = 'assets/shoot.mp3';
        this.sound_glass = new Audio();
        this.sound_glass.src = 'assets/glass.mp3';
        this.plane_pos = 0;
        this.plane_frame = 0;
        this.plane_slow = 6;
        this.plane_rotation_left = new Image();
        this.plane_rotation_left.src = 'sprites/loop_rotation_left.png';
        this.plane_speed_1 = new Image();
        this.plane_speed_1.src = 'sprites/loop_speed_1.png';
        this.plane_speed_2 = new Image();
        this.plane_speed_2.src = 'sprites/loop_speed_2.png';
        this.plane_speed_crack_1 = new Image();
        this.plane_speed_crack_1.src = 'sprites/loop_speed_1_crack.png';
        this.plane_speed_crack_2 = new Image();
        this.plane_speed_crack_2.src = 'sprites/loop_speed_2_crack.png';
        this.plane_sheet= new Image();
        this.plane_sheet.src = 'sprites/loop_plane.png';
        this.plane_shoot = new Image();
        this.plane_shoot.src = 'sprites/loop_shoot.png';
        this.plane_shoot_crack = new Image();
        this.plane_shoot_crack.src = 'sprites/loop_shoot_crack.png';
        this.plane_rotation_right_crack = new Image();
        this.plane_rotation_right_crack.src = 'sprites/loop_rotation_right_crack.png';
        this.plane_rotation_left_crack = new Image();
        this.plane_rotation_left_crack.src = 'sprites/loop_rotation_left_crack.png';

        this.damageState = 'normal';
        this.SetIndex = 0;
        this.speedPhase = 1;
        this.idleSprites = {normal: [this.plane_idle_1, this.plane_idle_2],
            crack1: [this.plane_idle_crack_1, this.plane_idle_crack_2]};
        this.speedSprites = {phase1: this.plane_speed_1,
                            phase2: this.plane_speed_2,
                            crack1_phase1: this.plane_speed_crack_1,
                            crack1_phase2: this.plane_speed_crack_2
        }

        this.shootSprites = {normal: this.plane_shoot, crack1: this.plane_shoot_crack};
        this.rightSprites = {normal: this.plane_rotation_right, crack1: this.plane_rotation_right_crack};
        this.leftSprites = {normal: this.plane_rotation_left, crack1: this.plane_rotation_left_crack};

        this.plane_idle = this.idleSprites[this.damageState][this.SetIndex];
 
        this.exploded = false;
        this.dodged = false;
        this.lives = 6;
        this.stopEnemies = false;
        this.didShoot = false;
        this.previousLives = this.lives;
    }
    updateDamage(){
        if(this.lives == 3){
            this.damageState = 'crack1';
            
        }
    }
    breakGlass(){
        if(this.lives != this.previousLives){
            this.sound_glass.play();
        }this.previousLives = this.lives;
    }
    drawPlane(KeyboardInput){
        this.updateDamage();
        switch(KeyboardInput.key){
            case'ArrowLeft':
            if (this.state !== 'rotation_left') {
                this.state = 'rotation_left';
                this.plane_pos = 0; // reset animation
                this.plane_frame = 0;
                track.pause();
                track.currentTime = 0;
            }
            break;                         
            case 'ArrowRight':
                if (this.state !== 'rotation_right') {
                    this.state = 'rotation_right';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                    track.pause();
                    track.currentTime = 0;
                } 
                break;
            case 'ArrowDown':
                if (this.state !== 'idle') {
                    this.state = 'idle';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                    this.speedPhase = 1; // reset when exiting speed
                    this.stopEnemies = false;
                    track.pause();
                    track.currentTime = 0;
                }
                break;

            case 'ArrowUp':
                if (this.state !== 'speed') {
                    this.state = 'speed';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                    this.speedPhase = 1; // start speed with phase 1
                    this.stopEnemies = true;
                }
                break;
            case 'Enter':
                if (this.state !== 'shoot') {
                    this.state = 'shoot';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                    track.pause();
                    track.currentTime = 0;
                } 
                break;           
        }
        if(this.state == 'rotation_left'){
            const currentLeftSprite = this.leftSprites[this.damageState];
            ctx.drawImage(currentLeftSprite,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if (this.plane_frame % this.plane_slow === 0) {
                this.plane_pos += sprite_size;
                if (this.plane_pos >= this.sprite_size_rotation) {
                    this.plane_pos = 0;
                    this.dodged = true;
                    this.state = 'idle';
                }
            }
            this.plane_frame++;  
        }
        else if(this.state == 'speed'){
            let currentSprite;
            track.play();
            if (this.damageState === 'normal') {
                currentSprite = (this.speedPhase === 1) ? this.speedSprites.phase1 : this.speedSprites.phase2;
            }else if (this.damageState === 'crack1') {
                currentSprite = (this.speedPhase === 1) ? this.speedSprites.crack1_phase1 : this.speedSprites.crack1_phase2;
            }
            ctx.drawImage(currentSprite, this.plane_pos, 0, sprite_size, sprite_size, 0, 0, cockpit_width, cockpit_height);
            if (this.plane_frame % this.plane_slow === 0) {
                this.plane_pos += sprite_size;

                const phase1_limit = 9600;
                const phase2_limit = 3600;

                if (this.speedPhase === 1 && this.plane_pos >= phase1_limit) {
                    // End of Phase 1: Switch to Phase 2
                    this.plane_pos = 0;
                    this.speedPhase = 2;
                } else if (this.speedPhase === 2 && this.plane_pos >= phase2_limit) {
                    // Loop Phase 2
                    this.plane_pos = 0;
                }
            }
            this.plane_frame++;
        } 
        else if(this.state == 'shoot'){
            const currentShootSprite = this.shootSprites[this.damageState];
            ctx.drawImage(currentShootSprite,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);

            if (this.plane_frame % this.plane_slow === 0) {
                this.plane_pos += sprite_size;
                if (this.plane_pos >= this.sprite_size_shoot) {
                    this.plane_pos = 0;
                    this.state = 'idle';
                    this.exploded = true;
                    this.sound_shoot.play();
                }
            }
            this.plane_frame++;
        }
        else if(this.state == 'rotation_right'){
            const currentRightSprite = this.rightSprites[this.damageState];
            ctx.drawImage(currentRightSprite,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);

            if (this.plane_frame % this.plane_slow === 0) {
                this.plane_pos += sprite_size;
                if (this.plane_pos >= this.sprite_size_rotation) {
                    this.plane_pos = 0;
                    this.dodged = true;
                    this.state = 'idle';
                }
            }
            this.plane_frame++;
        }
        else if(this.state == 'idle'){
            const currentIdleSprite = this.idleSprites[this.damageState][this.SetIndex];
            ctx.drawImage(currentIdleSprite,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if (this.plane_frame % this.plane_slow === 0) {
                this.plane_pos += sprite_size;
                if (this.plane_pos >= this.sprite_size_idle) {
                    this.plane_pos = 0;
                    this.SetIndex = 1 - this.SetIndex; // toggle between 0 and 1
                }
            }
            this.plane_frame++;
        }     
    }
}

const clouds = new Clouds();
const input = new KeyboardInput();
const plane = new Plane();
const enemy = new Enemy(sharedSounds);
const explosion = new Explosion();
const gameover = new GameOver();

function addEnemies() {
    if (addEnemyFrame++ >= 800 && nowEnemies <= maxEnemies) {
        nowEnemies += 1;
        Enemies.push(new Enemy(sharedSounds)); // Pass shared sounds
        addEnemyFrame = 0;
    }
}
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        stopGame();
    }
});
function stopGame() {
    gameStopped = !gameStopped;

    if (gameStopped) {
        engineSound.pause();
        if (sharedSounds.ufoengine) sharedSounds.ufoengine.pause();
        if (track) track.pause();
    } else {
        engineSound.play();
        sharedSounds.ufoengine.play();
        if (sharedSounds.ufoengine) sharedSounds.ufoengine.play();
        if (track) track.play();

        requestAnimationFrame(Animate);
    }
}
document.addEventListener('click', () => {
    engineSound.play();
  }, { once: true });
function Animate(){
    if (gameStopped) return;
    ctx.clearRect(0,0,cockpit_width,cockpit_height);
    ctx.drawImage(sky,0,0);
    clouds.drawClouds(input);
    if (plane.lives <= 0) {
        isGameOver = true;
         engineSound.pause();
            engineSound.currentTime = 0;
            sharedSounds.ufoengine.pause();
            sharedSounds.ufoengine.currentTime = 0;
    }

    if (isGameOver) {
        gameover.drawGameOver();
        if (gameover.played) {
            return; 
        }
        requestAnimationFrame(Animate);
        return;
    }

    if(plane.stopEnemies == false){
        addEnemies();
    }
    Enemies.forEach(enemy => {
        enemy.drawEnemy();
        if(enemy.inPos == true){
            enemy.moveEnemyOut();
        }else if(enemy.inPos == false){
            enemy.moveEnemyIn();
        }
        enemy.destroyEnemy(explosion,plane);
        enemy.avoidEnemy(plane); 
        enemy.stopEnemy(plane); 
        enemy.enemyShoot(plane);
        if(enemy.enemy_out == true){
            nowEnemies -=1;
            console.log(nowEnemies);
        }
        enemy.playUfo();
    });
    explosion.drawExplosion(plane);    
    Enemies = Enemies.filter(enemy => !enemy.destroyed && !enemy.enemy_out);
    plane.drawPlane(input);
    plane.breakGlass();
    requestAnimationFrame(Animate);
}
Animate();

});