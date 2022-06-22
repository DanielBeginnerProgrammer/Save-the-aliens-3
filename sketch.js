const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
//var


const start = 0;
const play = 1;
const derrota = 2;
const vitória = 3;

var GameState = start;

var BackgroundImg,backgroundSprite,collisionNaveSprite;

var shooter,motherNave,startSprite;

var shooterImg,shootingAnmtn,
    motherNaveImg,motherNaveDiyingAnmtn,
    motherNave25,motherNave10,lightRayImg,meteorImg,boxImg;

var boxScore,boxHp,boxVelocity;

var isShooting = false;
var gameIsOver = false;

var song1,song2,explosionSound;

var song1IsPlaying = true;
var spaceVelocity = 1
var frameCountValue = 200;

var hp = 100;
var rockForce = 10;
var score = 0;
//grupos
var rocks,lightRayGroup;;
//Valor para pegar o ultimo item do grupo "lightRayGroup"
var index;
function preload() {
  //song
  song1 = loadSound("/assets/songs/Clair_de_Lune.mp3");
  song2 = loadSound("/assets/songs/Sonic_Blaster.mp3");
  explosionSound = loadSound("/assets/songs/explosion.mp3");
  //background
    BackgroundImg = loadImage("/assets/Others/space.png");
  //motherNave
    motherNaveImg = loadImage("/assets/NaveMotherImages/motherNave.png");
    motherNaveDiyingAnmtn = loadAnimation("/assets/NaveMotherImages/motherDiying1.png","/assets/NaveMotherImages/motherDiying1.png","/assets/NaveMotherImages/motherDiying1.png",
                                          "/assets/NaveMotherImages/motherDiying2.png","/assets/NaveMotherImages/motherDiying2.png",
                                          "/assets/NaveMotherImages/motherDiying3.png","/assets/NaveMotherImages/motherDiying3.png",
                                          "/assets/NaveMotherImages/motherDiying4.png",
                                          "/assets/NaveMotherImages/MotherExplosion.png",
                                          "/assets/NaveMotherImages/explosion.png");
    motherNave25 = loadImage("/assets/NaveMotherImages/motherNave25.png");
    motherNave10 = loadImage("/assets/NaveMotherImages/motherNave10.png");
  //shooter
    shooterImg = loadImage("/assets/ShooterImages/player.png");
    shootingAnmtn = loadAnimation("/assets/ShooterImages/playerShine1.png","/assets/ShooterImages/playerShine2.png",
                                  "/assets/ShooterImages/playerShine3.png","/assets/ShooterImages/playerShine4.png",
                                  "/assets/ShooterImages/playerShine4.png","/assets/ShooterImages/playerShine4.png",
                                  "/assets/ShooterImages/playerShine2.png","/assets/ShooterImages/playerShine1.png");
  //meteor
    meteorImg = loadImage("/assets/Others/meteoro.png");
  //lightRay
    lightRayImg = loadImage("/assets/Others/light.png");
  //box
    boxImg = loadImage("assets/Others/box.png");
}

function setup() {
  //Config
  engine = Engine.create();
  world = engine.world;
  //Canvas
  createCanvas(800,750);
  frameRate(800);
  //background
  backgroundSprite = createSprite(300,0);
  backgroundSprite.addImage(BackgroundImg);
  backgroundSprite.scale = 1.5;
  backgroundSprite.visible = false;

  //start
  startSprite = createSprite(400,450,600,60);
  startSprite.visible = false;
  //MotherNave
  motherNave = createSprite(300,500,600,300);
  motherNave.addImage("normal",motherNaveImg);
  motherNave.addImage("25%",motherNave25);
  motherNave.addImage("10%",motherNave10);
  motherNave.addAnimation("Diying",motherNaveDiyingAnmtn);
  motherNave.scale = 1.5;
  motherNave.visible = false;
  //SHOOTER NAVE
  shooter = createSprite(300,500);
  shooter.addAnimation("normal",shooterImg);
  shooter.addAnimation("shooting",shootingAnmtn);
  shooter.scale = 0.2;
  shooter.visible = false;
  //Colisões daNave Mãe
  collisionNaveSprite = createSprite(300,620,600,200);
  collisionNaveSprite.visible = false;
  //Caixas de informação
  boxScore = createSprite(700,375);
  boxScore.addImage(boxImg);
  boxScore.scale = 0.78;
  boxScore.visible = false;

  boxHp = createSprite(700,650);
  boxHp.addImage(boxImg);
  boxHp.scale = 0.78;
  boxHp.visible = false;

  boxVelocity = createSprite(700,100);
  boxVelocity.addImage(boxImg);
  boxVelocity.scale = 0.78;
  boxVelocity.visible = false;

  //Groups
  lightRayGroup = new Group();
  rocks = new Group();
}

function draw() {
  background(0);
  //Modo de jogo play
  if (GameState === 0) {
    textSize(40)
    fill("royalBlue");
    text("Welcome to save the aliens",100,200);
    fill("red");
    text("Don't let the meteors hit you",100,250);
    fill("lightGreen");
    text("Press space to shoot",100,300);
    text("Press left and right to move the shooter",100,350);
    fill("yellow")
    text("Good luck",100,400);
    text("click here to start",100,450);

    if (mousePressedOver(startSprite)) {
      GameState = play;
    }
  }
  else if (GameState === 1) {
    startSprite.visible = false;
    backgroundSprite.visible = true;
    shooter.visible = true;
    motherNave.visible = true;
    boxVelocity.visible = true;
    boxHp.visible = true;
    boxScore.visible = true;
    //Rect
    fill(40,0,0);
    rect(120,40,700,800);
    //Text
    fill(255,0,0);
    textSize(15)
    text("Life: " + hp,670,655);
    text("Speed: " + spaceVelocity,670,105)
    text("Score: " + score,670,380)
    //songLoop
    if (!song1.isPlaying() && song1IsPlaying && !gameIsOver) {
      song1.play();
    }
    if (!song2.isPlaying() && !song1IsPlaying && !gameIsOver) {
      song2.play();
      song2.setVolume(0.1);
      song1.setVolume(0);
    }
    if (spaceVelocity >= 20) {
      song1IsPlaying = false;
    }
    //Plano de fundo se mexendo
    backgroundSprite.position.y = backgroundSprite.position.y + spaceVelocity;
    if (backgroundSprite.position.y > 1000) {
      backgroundSprite.position.y = 0;
    }

    //Movimentação do atirador(player)

      if (keyDown(LEFT_ARROW) && !(shooter.position.x < 101) && !gameIsOver) {
    shooter.position.x = shooter.position.x - 20;
    }
    
    if (keyDown(RIGHT_ARROW) && !(shooter.position.x > 489 && !gameIsOver)) {
      shooter.position.x = shooter.position.x + 20;
    }
  


    //Mudar a animação se isShooting for verdade, se for falso, volta a animação normal
    if (isShooting) {
      shooter.changeAnimation("shooting");
    }

    if(!isShooting){
      shooter.changeAnimation("normal");
    }
    
      //Se a posição y último item da matriz "lightRayGroup" for menor do que 500, isShooting será falso
    if (index !== undefined) {
      if (lightRayGroup[index].position.y <= 300) {
        isShooting = false;
      }
    }

    //Mother Nave images
  
    if (hp <= 25) {
      motherNave.changeImage("25%");
      motherNave.scale = 2;
    }
    if (hp <= 10) {
      motherNave.changeImage("10%");
      motherNave.scale = 2;
    }
  
    if (hp <= 0) {
      gameOver();
    }
  

    //text
    fill("#6d4c41"); 
    textSize(40);
    text("o", 300, 350); 
    textAlign(CENTER, CENTER);

    createRocks();
  }
  else if(GameState = 2){
    backgroundSprite.visible = false;
    textSize(50)
    text("You failed",100,350);
  }

  //desenhar os sprites
  drawSprites();
}

//Função para atirar lasers
function shootRay(){
  //Criar nova variável para laser
  var lightRay = createSprite(shooter.position.x,shooter.position.y,50,10);
  //Configurar imagem
  lightRay.addImage(lightRayImg);
  lightRay.scale = 0.05;
  //Velocidade
  lightRay.velocity.y = -20;
  isShooting = true;
  //Adicionar variável ao grupo  
  lightRayGroup.add(lightRay);
  //Dar a variavel index o valor do tamanho do grupo - 1(ou seja, o ultimo item do grupo)
  index = lightRayGroup.length - 1;
}
//Ativar algo quando a tecla for soltada
function keyReleased(){
  //se pressionar espaço, a função shootRay será ativada
  if (keyDown("space") && !gameIsOver) {
    shootRay();
  }
}
//Obs: achei mais conveniente fazer os meteoros por função do que por classe, funciona melhor pra mim
function createRocks() {
  if (!gameIsOver) {
    var rockId;
      if (frameCount % 200 === 0) {
        var rock = createSprite(Math.round(random(50,550)),-80,50,50);
        rock.addImage(meteorImg);
        rock.scale = 0.5;
        shooter.depth += 1;
        rocks.add(rock);
      } 
      //Pegar id do meteoro
      for (let index = 0; index < rocks.length; index++) {
        rocks[index].position.y += spaceVelocity;
        rockId = index;
      }
      //Verificar toque do meteoro com laser
      if (rocks[0] !== undefined) {
        if (lightRayGroup.isTouching(rocks)) {
          //Aumentar velocidade do espaço
          spaceVelocity += 1;
          rockForce += 1;
          //Destruir meteoro
          rocks.destroyEach();

          explosionSound.setVolume(0.1);
          explosionSound.play();
          score += 10;
        }
      }  
      if (spaceVelocity < 1) {
        spaceVelocity = 1;
      }
      //colisão com a nave mãe
      if (rocks.isTouching(collisionNaveSprite)) {
        hurtNave(rockForce);
      }

      if(score < 0){
        score = 0;
      }

      if (spaceVelocity <= 0) {
        spaceVelocity = 1;
      }
  }
}

function hurtNave(rockForce) {
  hp -= rockForce;

  spaceVelocity -= 1;
  if (spaceVelocity ==! 1) {
    rockForce -= 1;
  }


  rocks.destroyEach();
  score -= 5;
  explosionSound.setVolume(5);
  explosionSound.play();
}

function gameOver() {
  spaceVelocity = 0;
  gameIsOver = true;
  motherNave.changeImage("Diying");
  hp = 0;
  motherNave.velocity.y = 5.5;
  shooter.visible = false;
  motherNave.changeAnimation("diying");
  motherNave.scale = 2;
  song2.setVolume(0);
  song1.setVolume(0);
  GameState = derrota;
}