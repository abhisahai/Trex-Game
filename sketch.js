var trex ,trex_running, trex_collided;
var ground, groundImage;
var barrier;
var clouds, cloudImg
var obstacle
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score = 0;
var play = 1;
var end = 0;
var gamestate = play;
var cactiGroup, cloudsGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var jump, death, checkpoint;

//predifined func. loads animations, images and sounds
function preload(){
  trex_running = loadAnimation('trex1.png','trex3.png','trex4.png');
  groundImage = loadImage('ground2.png');
  cloudImg = loadImage('cloud.png');
  obstacle1 = loadImage('obstacle1.png');
  obstacle2 = loadImage('obstacle2.png');
  obstacle3 = loadImage('obstacle3.png');
  obstacle4 = loadImage('obstacle4.png');
  obstacle5 = loadImage('obstacle5.png');
  obstacle6 = loadImage('obstacle6.png');
  gameOverImg = loadImage('gameOver.png');
  restartImg = loadImage('restart.png');
  trex_collided = loadAnimation('trex_collided.png');
  jump = loadSound('jump.mp3');
  death = loadSound('Death.m4a');
  checkpoint = loadSound('checkPoint.mp3');
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  
  //create a trex sprite
  trex = createSprite(50,height-50);
  trex.addAnimation('running',trex_running);
  trex.scale = 0.75;
  trex.addAnimation('collided', trex_collided);
  // trex.setCollider('rectangle',0,0,300,80);
  trex.setCollider('circle',0,0,40);

  ground = createSprite(width/2,height-20);
  ground.addImage(groundImage);
  ground.velocityX = -4;
  ground.scale = 1.75;

  barrier = createSprite(width/2,height-20,width,1);
  barrier.visible = false;

  gameOver = createSprite(width/2, height/2-25);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2, height/2+50);
  restart.addImage(restartImg);

  cactiGroup = new Group();
  cloudsGroup = new Group();  
}
///////////////////////////////////////////////////////////////////
function draw(){
  background("white");
  
  textSize(20);
  text('Score: '+score, 50,50);
   
  if(gamestate == play){
    //score = score + Math.round(getFrameRate()/60);
    score = score + Math.round(0.75);

    if(touches.length>0 || keyDown('space') && trex.collide(barrier)){
      jump.setVolume(1.25);
      jump.play();
      trex.velocityY = -17.5;
      touches = [];
    }
  
    if (ground.x < 0 ){
      ground.x = width/2;
    }
    
    spawnClouds();
    spawnCacti();

    //gravity
    trex.velocityY += 0.5;
    trex.collide(barrier);
    
    ground.velocityX = -(4+(score));

    gameOver.visible = false;
    restart.visible = false;

    if(score%50 == 0 && score != 0){
      checkpoint.play();
    }

    if(trex.isTouching(cactiGroup)){
      death.play();
      gamestate = end;
      // trex.velocityY = -10;
      // jump.setVolume(1.25)
      // jump.play();
    }
  }
  else if (gamestate == end){
    ground.velocityX = 0;    
    trex.velocityY = 0;

    cactiGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    trex.changeAnimation('collided');

    gameOver.visible = true;
    restart.visible = true;

    cactiGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1); 

    trex.rotation = -90;
    trex.y = height-trex.height/2;
    

    if (mousePressedOver(restart)){
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds(){
  if (frameCount%60 == 0){
    var r = random(10,width/2);
    console.log(r);
    cloud = createSprite(width,r);
    cloud.addImage(cloudImg);
    cloud.velocityX = ground.velocityX;
    trex.depth = cloud.depth+1;
    cloud.lifetime = width/3;
    cloudsGroup.add(cloud);
  }
}

function spawnCacti(){
  if (frameCount % 90 == 0){
    var r = Math.round(random(1,6));
    obstacle = createSprite(width+20,height-50);
    obstacle.velocityX = ground.velocityX;
    switch(r){
      case 1:obstacle.addImage(obstacle1);
      break;
      case 2:obstacle.addImage(obstacle2);
      break;
      case 3:obstacle.addImage(obstacle3);
      break;
      case 4:obstacle.addImage(obstacle4);
      break;
      case 5:obstacle.addImage(obstacle5);
      break;
      case 6:obstacle.addImage(obstacle6);
      break;
      default:break;
    }
    obstacle.lifetime = width/3
    cactiGroup.add(obstacle);
    trex.depth = obstacle.depth+1;
  }
}

function reset(){
  score = 0;
  gamestate = play;
  cactiGroup.setLifetimeEach(0);
  cloudsGroup.setLifetimeEach(0);
  trex.changeAnimation('running');
  trex.rotation = 0
}
