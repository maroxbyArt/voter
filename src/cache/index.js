import 'phaser';
import pkg from 'phaser/package.json';
import introImage from 'img/study.png';
import mapCSV from './img/home.csv';
import mapJSON from 'img/home.json';
import tilesSS from 'img/tiles.png';
import playerGrid from 'img/playerGrid.png';
import trainerSS from 'img/playerB/trainerBeta.png';
import state from './classes/state';
import Phaser from 'phaser';

// This is the entry point of your game.

const width = 1000;
const height = 900;
var map;
var tiles;
var layer;
var player;
var controls;
var cursors;


console.log(state);

const config = {
  type: Phaser.AUTO,
  parent: "game",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 } // Top down game, so no gravity
    }
  },
  width,
  height,
  scene: { preload, create, update },
};


var game = new Phaser.Game(config);

function preload() {

  this.load.image("tiles", tilesSS);
  this.load.tilemapTiledJSON('map', mapJSON);

  //this.load.setPath('assets/');
  //this.load.multiatlas('trainer', trainerSS, 'assets');
  this.load.spritesheet('trainer', trainerSS, { frameWidth: 32, frameHeight: 32 });

}



function create() {

  map = this.make.tilemap({ key: 'map' });


  tiles = map.addTilesetImage('base', 'tiles');

  const belowLayer = map.createStaticLayer("Background", tiles, 0, 0);
  const worldLayer = map.createStaticLayer("World", tiles, 0, 0);
  const hSLayer = map.createStaticLayer("Hotspots", tiles, 0, 0);
  worldLayer.setCollisionByProperty({collides: true})
  hSLayer.setCollisionByProperty({collides: true})

  this.rooms = [];

  map.findObject('Rooms', function(object) {

    // rooms
    if (object.type === 'room') {
      console.log("FOUND ROOM");
      console.log(object);
        this.rooms.push(object);
    }

  }, this);


  const camera = this.cameras.main;
  camera.setZoom(2);

  // Set up the arrows to control the camera
  cursors = this.input.keyboard.createCursorKeys();
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 0.5
  });

  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // === PLAYER ===
  var config = {
    key: 'down',
    frames: this.anims.generateFrameNumbers('trainer', { start: 0, end: 1, first: 0 }),
    frameRate: 1,
    repeat: -1
};


this.anims.create(config);
this.player = this.physics.add.sprite(400, 300, 'trainer');
camera.startFollow(this.player);

this.physics.add.collider(
  this.player, 
  worldLayer,
);
this.physics.add.collider(
  this.player, 
  hSLayer,
  () => console.log("HIT"), 
  null, 
  this
);
  
}

function update(time, delta) {
  // Apply the controls to the camera each update tick of the game
  controls.update(delta);

  const speed = 175;
  const prevVelocity = this.player.body.velocity.clone();

  // Stop any previous movement from the last frame
  this.player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
    this.player.body.setVelocityX(-100);
  } else if (cursors.right.isDown) {
    this.player.body.setVelocityX(100);
  }

  // Vertical movement
  if (cursors.up.isDown) {
    this.player.body.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    this.player.body.setVelocityY(100);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  this.player.body.velocity.normalize().scale(speed);

  if (this.player.roomChange) {
    this.cameras.main.setBounds(
      this.rooms[this.player.currentRoom].x,                                
      this.rooms[this.player.currentRoom].y,                                
      this.rooms[this.player.currentRoom].width,                                
      this.rooms[this.player.currentRoom].height,                                
      true
    ); 
  }


}

