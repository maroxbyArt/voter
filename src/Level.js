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

                    var targetRoom = Rooms.GetRoomByID(this.rooms, this.player.currentRoom);
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

                            //this.player.canMove = true;
                            //this.roomStart(this.player.currentRoom);
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

                if(this.player.roomChange == true)
                    return;

                console.log("ON STAIRS");

                console.log(player);
                console.log(portal);

                this.ChangeMap(player, portal);

                /*
                var roomLabel = "";
                var targetRoomObj = portal.tileObj;
                var targetRoomProps = targetRoomObj.properties;
                var targetRoom = Utils.GetPropertyByName("room", targetRoomProps)
                console.log("TARGET ROOM: " + targetRoom);
                
                var targetRoomSuffix = Utils.GetPropertyByName("to_suffix", targetRoomProps)
                console.log("TARGET ROOM SUFFIX: " + targetRoomSuffix);

                if(targetRoom != 'exit'){
                    roomLabel = targetRoom + targetRoomSuffix;
                    console.log("ROOM CHANGE: " + roomLabel);
                    console.log("ROOM SUFFIX: " + targetRoomSuffix);
                    console.log("ROOM PROPS: " + JSON.stringify(targetRoomProps));
                    
                }
            
                var roomIndex = Rooms.GetRoomByName(roomLabel, this.rooms);

                this.player.currentRoom = roomIndex;
                this.player.roomChange = true;
                this.player.onStairs = true;
                */

            }, 
            null, 
            this
        );

    }

    ChangeMap = (player, portal) => {

        var targetPortalID = portal.portalLink;
        var targetPortal = Portals.GetPortalByID(targetPortalID, this.portals.getChildren());

        var targetRoom = Rooms.GetRoomByID(targetPortal.room, this.rooms);
        console.log("=======================================");



        /*
        var roomLabel = "";
        var targetRoomObj = portal.tileObj;
        var targetRoomProps = targetRoomObj.properties;
        var targetRoom = Utils.GetPropertyByName("room", targetRoomProps)
        */

    }

    LoadRoom = (name) => {
        for(var i = 0; i < this.rooms.length; i++){

            console.log("ROOMs");
            console.log(this.rooms[i].name);

            if(this.rooms[i].name === name){
                console.log("FOUND ROOM");
                this.player.currentRoom = i;

            }

        };

    }

    roomStart(roomNumber) {
        if (roomNumber == 4) {
            this.cameras.main.shake(2500, 0.001, true);
        }
    }


}