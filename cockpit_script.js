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

class KeyboardInput{
    constructor(){
        this.key = '';
        window.addEventListener('keydown', down =>{
            if(down.key == 'ArrowUp'   ||
               down.key == 'ArrowDown' ||
               down.key == 'ArrowLeft' ||
               down.key == 'ArrowRight' ||
               down.key == 'Enter'  )
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
class Enemy{
    constructor(){    
        this.enemy = new Image();
        this.insult = 0;
        this.enemy.src = 'sprites/sprite_saucer_move_transparent.png';
        this.sound_boom = new Audio();
        this.sound_boom.src = 'assets/boom.mp3';
        this.sound_ufoengine = new Audio();
        this.sound_ufoengine.src = 'assets/ufoengine.mp3';
        this.sound_ufoengine.loop = true;
        this.sound_par1 = new Audio();
        this.sound_par1.src = 'assets/par1.mp3';
        this.sound_12min = new Audio();
        this.sound_12min.src = 'assets/12min.mp3';
        this.sound_laser = new Audio();
        this.sound_laser.src = 'assets/laser.mp3';
        this.sound_cult1 = new Audio();
        this.sound_cult1.src = 'assets/cult1.mp3';
        this.sound_cult2 = new Audio();
        this.sound_cult2.src = 'assets/cult2.mp3';
        this.sound_ich = new Audio();
        this.sound_ich.src = 'assets/ich.mp3';
        this.sound_loslos = new Audio();
        this.sound_loslos.src = 'assets/loslos.mp3';
        this.sound_nein = new Audio();
        this.sound_nein.src = 'assets/nein.mp3';
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
    avoidEnemy(Plane){
        if(Plane.dodged == true && this.inPos == true){
            if(this.inPos == true && this.enemy_place == 'right'){
                this.avoided = true;
                Plane.dodged = false;
                this.inPos = false;
                this.insult = Math.floor(Math.random() * 3);
                switch(this.insult){
                    case 0:
                        this.sound_12min.play();
                        break;
                    case 1:
                        this.sound_cult1.play();
                        break;
                    case 2:
                        this.sound_cult2.play();
                        break;
                }

            }else if(this.inPos == true && this.enemy_place == 'left'){
                this.avoided = true;
                Plane.dodged = false;
                this.inPos = false;
                this.insult = Math.floor(Math.random() * 3);
                switch(this.insult){
                    case 0:
                        this.sound_ich.play();
                        break;
                    case 1:
                        this.sound_loslos.play();
                        break;
                    case 2:
                        this.sound_nein.play();
                        break;
                }
            }
        }else if(Plane.dodged == true && this.inPos == false){
            Plane.dodged = false;
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
        this.plane_sheet= new Image();
        this.plane_sheet.src = 'sprites/loop_plane.png';
        this.plane_anims = [];
        this.damageState = 'normal';
        this.idleSetIndex = 0;
        this.idleSprites = {normal: [this.plane_idle_1, this.plane_idle_2],
            crack1: [this.plane_idle_crack_1, this.plane_idle_crack_2]};
        this.animStates = [{name: 'rotation_left', frames: 10,},{name: 'rotation_right', frames: 10,},
        {name: 'speed_1', frames: 16},{name: 'speed_2', frames: 6},{name: 'shoot', frames: 8},
        {name: 'idle_1', frames: 38},{name: 'idle_2', frames: 38}];

        this.animStates.forEach((state,index) => {
            let frames = {
                location: [],
            }
            for(let i = 0; i < state.frames; i++){
                let positionX = sprite_size * i;
                let positionY = sprite_size * index;
                frames.location.push({x: positionX, y: positionY});
            }
            this.plane_anims[state.name] = frames;
        });
        console.log(this.plane_anims);

        //this.plane_idle = this.plane_idle_1;
        this.plane_idle = this.idleSprites[this.damageState][this.idleSetIndex];
        this.plane_pos = 0;
        this.plane_frame = 0;
        this.plane_slow = 6;
        this.plane_rotation_left = new Image();
        this.plane_rotation_left.src = 'sprites/loop_rotation_left.png';
        this.plane_speed_1 = new Image();
        this.plane_speed_1.src = 'sprites/loop_speed_1.png';
        this.plane_speed_2 = new Image();
        this.plane_speed_2.src = 'sprites/loop_speed_2.png';
        this.plane_speed = this.plane_speed_1;
        this.plane_shoot = new Image();
        this.plane_shoot.src = 'sprites/loop_shoot.png';
        this.exploded = false;
        this.dodged = false;
        this.lives = 3;
    }
    updateDamage(){
        if(this.lives == 1){
            this.damageState = 'crack1';
            this.sound_glass.play();
        }
    }
    drawPlane(KeyboardInput){
        this.updateDamage();
        switch(KeyboardInput.key){
            case'ArrowLeft':
            if (this.state !== 'rotation_left') {
                this.state = 'rotation_left';
                this.plane_pos = 0; // reset animation
                this.plane_frame = 0;
            }
            break;           
            case 'ArrowUp':
                if (this.state !== 'speed') {
                    this.state = 'speed';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                }
                break;                
            case 'ArrowRight':
                if (this.state !== 'rotation_right') {
                    this.state = 'rotation_right';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                } 
                break;
            case 'ArrowDown':
                if (this.state !== 'idle') {
                    this.state = 'idle';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                    this.plane_speed = this.plane_speed_1;
                } 
                break;
            case 'Enter':
                if (this.state !== 'shoot') {
                    this.state = 'shoot';
                    this.plane_pos = 0;
                    this.plane_frame = 0;
                } 
                break;           
        }
        if(this.state == 'rotation_left'){
            
            ctx.drawImage(this.plane_rotation_left,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if(this.plane_frame % this.plane_slow == 0){
                if(this.plane_pos == (this.sprite_size_rotation-sprite_size)){
                    this.plane_pos = 0;
                    this.dodged = true;
                    this.state = 'idle';
                }else{
                    this.plane_pos +=600;
                }
                this.plane_frame++;
            }else{
                this.plane_frame++;
            }      
        }
        else if(this.state == 'speed'){
            ctx.drawImage(this.plane_speed,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if(this.plane_frame % this.plane_slow == 0){
                if(this.plane_pos == (this.sprite_size_speed - sprite_size) && this.plane_speed == this.plane_speed_1){
                    this.plane_speed = this.plane_speed_2;
                    this.plane_pos = 0;
                    this.sprite_size_speed = 3600;
                }else if(this.plane_pos == (this.sprite_size_speed - sprite_size) && this.plane_speed == this.plane_speed_2){
                    this.plane_pos = 0;
                }else{
                    this.plane_pos += sprite_size;
                }
            }
            this.plane_frame++;      
        }
        else if(this.state == 'shoot'){
            ctx.drawImage(this.plane_shoot,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if(this.plane_frame % this.plane_slow == 0){
                if(this.plane_pos == (this.sprite_size_shoot -sprite_size)){
                    this.plane_pos = 0;
                    this.state = 'idle';
                    this.exploded = true;
                    this.sound_shoot.play();
                }else{
                    this.plane_pos +=sprite_size;
                }
            }
            this.plane_frame++;
        }
        else if(this.state == 'rotation_right'){
            ctx.drawImage(this.plane_rotation_right,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if(this.plane_frame % this.plane_slow == 0){
                if(this.plane_pos == (this.sprite_size_rotation-sprite_size)){
                    this.plane_pos = 0;
                    this.state = 'idle';
                    this.dodged = true;
                }else{
                    this.plane_pos +=sprite_size;
                }
                this.plane_frame++;
            }else{
                this.plane_frame++;
            }
        }
        else if(this.state == 'idle'){
            const currentIdleSprite = this.idleSprites[this.damageState][this.idleSetIndex];
            ctx.drawImage(currentIdleSprite,this.plane_pos,0,sprite_size,sprite_size,0,0,cockpit_width,cockpit_height);
            if (this.plane_frame % this.plane_slow === 0) {
                this.plane_pos += sprite_size;
                if (this.plane_pos >= this.sprite_size_idle) {
                    this.plane_pos = 0;
                    this.idleSetIndex = 1 - this.idleSetIndex; // toggle between 0 and 1
                }
            }
            this.plane_frame++;
        }     
    }
}

const clouds = new Clouds();
const input = new KeyboardInput();
const plane = new Plane();
const enemy = new Enemy();
const explosion = new Explosion();

function addEnemies(){
    if(addEnemyFrame++ >= 800 && nowEnemies <= maxEnemies){
            nowEnemies +=1;
            Enemies.push(new Enemy());
            addEnemyFrame = 0;
        }
}
//engineSound.play();
document.addEventListener('click', () => {
    engineSound.play();
  }, { once: true });
function Animate(){
    ctx.clearRect(0,0,cockpit_width,cockpit_height);
    ctx.drawImage(sky,0,0);
    clouds.drawClouds(input);
    addEnemies();
    Enemies.forEach(enemy => {
        enemy.drawEnemy();
        if(enemy.inPos == true){
            enemy.moveEnemyOut();
        }else if(enemy.inPos == false){
            enemy.moveEnemyIn();
        }
        enemy.destroyEnemy(explosion,plane);
        enemy.avoidEnemy(plane);  
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
    requestAnimationFrame(Animate);
}
Animate();