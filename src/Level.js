import mapJSON from 'img/home.json';
import tilesSS from 'img/tiles.png';
import playerImg from 'img/playerGrid.png';
import Player from 'Player.js'
import SceneData from 'SceneData.js'

import Utils from 'Utils.js'
import Portals from 'Portals.js'
import Rooms from 'Rooms.js'


/**
 * Class representing a level (https://photonstorm.github.io/phaser3-docs/Phaser.Scene.html)
 * @extends Phaser.Scene
 */
 export default class Level extends Phaser.Scene {

    /** Create the level. */
    constructor() {
        super({key: 'level'});

        this.isFading = false;
    }

    /** Load assets. */
    preload() {

        this.load.spritesheet(
            'trainer', 
            playerImg, 
            { 
                frameWidth: 32, 
                frameHeight: 32,
                startFrame: 0, 
                margin: 0,
                spacing: 0
            }
        );


        this.load.image("tiles", tilesSS);
        this.load.tilemapTiledJSON('level-1', mapJSON);
    }

    /** Setup level. */
    create() {
        // Make map of level 1.
        this.map = this.make.tilemap({key: "level-1"});

        // Define tiles used in map.
        const tileset = this.map.addTilesetImage("base",  "tiles", 32, 32);


        // The map layers.
        this.belowLayer = this.map.createStaticLayer("Background", tileset, 0, 0);
        this.worldLayer = this.map.createStaticLayer("World", tileset, 0, 0);
        this.hSLayer = this.map.createStaticLayer("Hotspots", tileset, 0, 0);
        
        this.player = new Player(this.scene.scene, 400, 300, 'trainer');

        // Set physics boundaries from map width and height.
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Collisions based on layer.
        this.worldLayer.setCollisionByProperty({collides: true});

        
        // Setup things in this level.
        this.rooms = [];
        this.portals = this.physics.add.group();﻿


        this.data = new SceneData(this);

        //Add Colliders
        this.InitColliders();


        // start camera
        this.LoadRoom("main");
        

    }

    /** Update called every tick. */
    update(time, delta) {

        this.cameras.main._ch = this.map.heightInPixels;
        this.cameras.main._cw = this.map.widthInPixels;

        
        // On player room change, stop player movement, fade camerea, and set boundaries.

        if (this.player.roomChange && !this.isFading) {

            this.isFading = true;

            this.cameras.main.fadeOut(500, 0, 0, 0, function(camera, progress){                
                if(progress == 1){

                    var targetRoom = Rooms.GetRoomByID(this.player.currentRoom, this.rooms);
                    console.log("Target Room: " + targetRoom);

                    // Change camera boundaries when fade out complete.
                    this.cameras.main.setBounds(
                        targetRoom.x,
                        targetRoom.y,
                        targetRoom.width,
                        targetRoom.height,
                        true
                    );

                    this.cameras.main.fadeIn(500, 0, 0, 0, function(camera, progress) {
                        
                        if (progress === 1) {
                            this.player.roomChange = false;
                            this.player.canMove = true;
                            this.isFading = false;


                            this.OnLoadRoom(Portals.GetPortalByID(this.player.currentRoom, this.portals.getChildren()));

                            this.roomStart(this.player.currentRoom);
                        }
                        
                    }, this);

                }

            });


        }
        

    }

    InitCameras = () => {

        this.cameras.main.setZoom(2.0);

        // Set first room boundaries.
        this.cameras.main.setBounds(
            this.rooms[this.player.currentRoom].x,
            this.rooms[this.player.currentRoom].y,
            this.rooms[this.player.currentRoom].width,
            this.rooms[this.player.currentRoom].height,
            true
        );
        

        this.cameras.main.startFollow(this.player);

    }
    
    InitColliders = () => {

        // Add collisions.
        this.physics.add.collider(this.player, this.worldLayer);

        this.physics.add.overlap(
            this.player,  
            this.portals,    

            function(player, portal) {

                if(
                    player.roomChange == true ||
                    portal.suspend == true
                )
                    return;

                console.log("ON STAIRS");

                console.log(player);
                console.log(portal);

                
                this.ChangeMap(player, portal);

                this.player.onStairs = true;


            }, 
            null, 
            this
        );

    }

    ChangeMap = (player, portal) => {

        this.player.roomChange = true;

        var targetPortalID = portal.portalLink;
        var targetPortal = Portals.GetPortalByID(targetPortalID, this.portals.getChildren());
        var targetRoom = Rooms.GetRoomByID(targetPortal.room, this.rooms);

        this.LoadRoom(targetRoom, targetPortal);

        this.data.prevPortal = this.data.currPortal;
        this.data.currPortal = targetPortal;


    }

    LoadRoom = (roomObj, portalObj = null) => {
        console.log("LOAD ROOM");
        this.player.currentRoom = roomObj.id;

        if(portalObj != null){
            this.player.x = portalObj.x;
            this.player.y = portalObj.y;
        }

    }

    OnLoadRoom = (targetPortal) => {

        console.log("target portal: " + JSON.stringify(this.data.currPortal));

        this.player.onStairs = false;
        this.data.currPortal.suspend = true;


    }

    roomStart(roomNumber) {
        if (roomNumber == 4) {
            this.cameras.main.shake(2500, 0.001, true);
        }
    }


}