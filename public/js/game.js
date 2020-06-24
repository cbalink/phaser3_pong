const WIDTH = 800;
const HEIGHT = 600;


var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade'
      },
    scene: {
        preload: preloadGame,
        create: createGame,
        update: updateGame,
    },  
    scale: {
        mode: Phaser.Scale.FIT,
        width: 800,
        height: 400
    }
};

var game = new Phaser.Game(config);

var ball;
var leftPaddle, rightPaddle;
var leftScore = 0, rightScore = 0;
var leftScoreText, rightScoreText;
var ballHitSound;
const BALL_SPEED = 150;

function preloadGame (){  
    this.load.image('paddle', 'assets/paddle.png');
    this.load.spritesheet('ball', 'assets/pokeball.png', { frameWidth: 180, frameHeight: 180 });
    this.load.audio('ball_hit', 'assets/ball_hit.mp3');
}

function createGame (){
    createObjects.call(this);
    createControls.call(this);
}

function updateGame (){
    checkBallOut.call(this);
}

function createObjects(){
    createLeftPaddle.call(this);
    createRightPaddle.call(this);
    createBall.call(this);
    createTextScores.call(this);
    createSounds.call(this);
}

function createLeftPaddle(){
    const width = 24;
    const height = 104;
    
    this.leftPaddle = this.physics.add
    .sprite(2*width, HEIGHT / 2, 'paddle')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(width, height)
    .setCollideWorldBounds(true)
    .setImmovable(true);

    this.leftPaddle.tintFill = true;
    this.leftPaddle.tint = 0xff0000;
}

function createRightPaddle(){
    const width = 24;
    const height = 104;

    this.rightPaddle = this.physics.add
    .sprite(WIDTH - 2* width, HEIGHT / 2, 'paddle')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(width, height)
    .setCollideWorldBounds(true)
    .setImmovable(true);

    this.rightPaddle.tintFill = true;
    this.rightPaddle.tint = 0x0000ff;  
}

function createBall(){
    this.ball = this.physics.add
        .sprite(WIDTH / 2, HEIGHT / 2, "ball")
        .setOrigin(0.5,0.5)
        .setDisplaySize(24,24)
        .setCollideWorldBounds(true)
        .setBounce(1);

        this.physics.add.collider(this.rightPaddle, this.ball, onPaddleBallCollision, null, this);
        this.physics.add.collider(this.leftPaddle, this.ball, onPaddleBallCollision, null, this);

        var ballAnimation = this.anims.create({
            key: 'bounce',
            frames: this.anims.generateFrameNumbers('ball'),
            frameRate: 16,
            repeat: -1
        });
        resetBall.call(this);    
}

function createTextScores(){
    this.leftScoreText = this.add.text(100,50, leftScore, {fontSize: '48px', color: '#ff0000'}).setOrigin(0.5,0.5);
    this.rightScoreText = this.add.text(WIDTH - 100,50, rightScore, {fontSize: '48px', color: '#0000ff'}).setOrigin(0.5,0.5);
}

function createSounds(){
    this.ballHitSound = this.sound.add("ball_hit");
}

function onPaddleBallCollision(paddle, ball){
    increaseBallVelocity(ball);
    shrinkPaddle.call(this, paddle,ball);
    this.ballHitSound.play();
    ball.anims.reverse();
    ball.anims.setTimeScale(ball.anims.getTimeScale() + 1);
}


function increaseBallVelocity(ball) {
    ball.body.velocity.scale(1.2, 1.2);
}

function shrinkPaddle(paddle, ball){
    this.tweens.add({
        targets: paddle, 
        duration: 50, 
        scaleX: 0.5, 
        scaleY: 0.5, 
        yoyo: true, 
      });
}

function checkBallOut(){ 
    if (this.ball.x <= this.ball.displayWidth) {
        rightScore++;
        this.rightScoreText.setText(rightScore);
        resetBall.call(this);
    } else if (this.ball.x >= WIDTH - this.ball.displayWidth) {
        leftScore++;
        this.leftScoreText.setText(leftScore);
        resetBall.call(this);
    }
}

var direction = 1;
function resetBall() {
    
    this.ball.x = WIDTH / 2;
    this.ball.y = HEIGHT / 2;
    direction *= -1;
    this.ball.setVelocity(direction * BALL_SPEED, BALL_SPEED);
    this.ball.anims.stop();
    this.ball.anims.setTimeScale(1);
    this.ball.anims.play("bounce");
    
  }

function createControls(){
    //leftpaddle
    const velocity = 700;
    this.input.keyboard.on('keydown_W', () => {
      this.leftPaddle.setVelocityY(velocity * -1);
    });

    this.input.keyboard.on('keyup_W', () => {
        this.leftPaddle.setVelocityY(0);
    });
    
    this.input.keyboard.on('keydown_S', () => {
      this.leftPaddle.setVelocityY(velocity);
    });

    this.input.keyboard.on('keyup_S', () => {
        this.leftPaddle.setVelocityY(0);
    }); 
    //rightpaddle
    this.input.keyboard.on('keydown_UP', () => {
        this.rightPaddle.setVelocityY(velocity * -1);
      });
  
      this.input.keyboard.on('keyup_UP', () => {
          this.rightPaddle.setVelocityY(0);
      });
      
      this.input.keyboard.on('keydown_DOWN', () => {
        this.rightPaddle.setVelocityY(velocity);
      });
  
      this.input.keyboard.on('keyup_DOWN', () => {
          this.rightPaddle.setVelocityY(0);
      }); 
}
