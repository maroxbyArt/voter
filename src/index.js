import 'phaser';
import pkg from 'phaser/package.json';
import introImage from 'img/study.png';
import mapCSV from './img/home.csv';
import mapJSON from 'img/home.json';
import tilesSS from 'img/tiles.png';

import Phaser from 'phaser';

// This is the entry point of your game.

const width = 1000;
const height = 900;
var map;
var tiles;
var layer;
var controls;


const config = {
  type: Phaser.AUTO,
  parent: "game",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  width,
  height,
  scene: { preload, create, update },
};


var game = new Phaser.Game(config);

function preload() {

  this.load.image("tiles", tilesSS);
  this.load.tilemapTiledJSON('map', mapJSON);

}



function create() {

  map = this.make.tilemap({ key: 'map' });
  console.log(map);


  tiles = map.addTilesetImage('base', 'tiles');

  var layer = map.createStaticLayer(0, tiles, 0, 0);

  const camera = this.cameras.main;
  // Set up the arrows to control the camera
  const cursors = this.input.keyboard.createCursorKeys();
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 0.5
  });

  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  
}

function update(time, delta) {
  // Apply the controls to the camera each update tick of the game
  controls.update(delta);
}

