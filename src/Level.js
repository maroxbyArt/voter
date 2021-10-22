import mapJSON from 'img/home.json';
import tilesSS from 'img/tiles.png';
import playerImg from 'img/playerGrid.png';
import Player from 'Player.js'
import SceneData from 'SceneData.js'

import Utils from 'Utils.js'
import Portals from 'Portals.js'
import Rooms from 'Rooms.js'

var cursors;

var OnPlayerOverlapProcess = function (player, portal, data) {

                
    console.log("!!!OnPlayerOverlapProcess [this]: " +  JSON.stringify(this));
    console.log("!!!OnPlayerOverlapProcess [this.player]: " +  JSON.stringify(this.player));
    console.log("!!!OnPlayerOverlapProcess [portal]: " +  JSON.stringify(portal));
    console.log("!!!OnPlayerOverlapProcess [data]: " +  JSON.stringify(data));

    if(
        //player.roomChange == true ||
        portal.suspend == true
    ){
        return;

    } else {
        console.log("!!!OnPlayerOverlapProcess!!!");
        //return true;
    }

    //console.log("player: " + JSON.stringify(player));
    //console.log("portal: " + JSON.stringify(portal));

    //return true;
    
}

var OnPlayerOverlap = function (player, portal, data) {

    console.log("!!!OnPlayerOverlap [player]: " +  JSON.stringify(player));
    console.log("!!!OnPlayerOverlap [portal]: " +  JSON.stringify(portal));
    console.log("!!!OnPlayerOverlap [data]: " +  JSON.stringify(data));


    if(
        this.player.roomChange == false 
    ){
        var activePortal = Portals.GetPortalByName(portal.name);
        console.log("!!!OnPlayerOverlap [activePortal]: " + activePortal);

        this.ChangeMap(this.player, activePortal);
        this.player.onStairs = true;

    }
    


}

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
        //this.player = this.physics.add.image(400, 300, 'trainer');
        cursors = this.input.keyboard.createCursorKeys();

        // Set physics boundaries from map width and height.
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        // Collisions based on layer.
        this.worldLayer.setCollisionByProperty({collides: true});

        
        // Setup things in this level.
        this.rooms = [];
        this.portals = this.physics.add.group();﻿
        //this.portals = this.physics.add.staticGroup();


        this.data = new SceneData(this);

        //Add Colliders
        this.InitColliders();


        // start camera
        this.LoadRoom("main");
        

    }

    /** Update called every tick. */
    update(time, delta) {




        //this.cameras.main._ch = this.map.heightInPixels;
        //this.cameras.main._cw = this.map.widthInPixels;

        
        // On player room change, stop player movement, fade camerea, and set boundaries.

        if (this.player.roomChange && !this.isFading) {

            this.isFading = true;

            this.cameras.main.fadeOut(500, 0, 0, 0, function(camera, progress){                
                if(progress == 1){

                    var targetRoom = Rooms.GetRoomByID(this.player.currentRoom, this.rooms);
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    console.log("Target Room: " + targetRoom);
                    console.log("Target Room[x]: " + targetRoom.x);
                    console.log("Target Room[y]: " + targetRoom.y);
                    console.log("Target Room[width]: " + targetRoom.width);
                    console.log("Target Room[height]: " + targetRoom.height);
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");


                    // Change camera boundaries when fade out complete.
                    this.OnLoadRoom(Portals.GetPortalByID(this.player.currentRoom, this.portals.getChildren()));


                    this.cameras.main.fadeIn(500, 0, 0, 0, function(camera, progress) {
                        
                        if (progress === 1) {



                            this.player.roomChange = false;
                            this.player.canMove = true;
                            this.isFading = false;


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
        //this.physics.add.collider(this.player, this.worldLayer);

        this.physics.add.overlap(
            this.player,  
            this.portals,    
            (player, portal) => {

                
                //console.log("!!!OnPlayerOverlapProcess [this]: " +  JSON.stringify(this));
                console.log("!!!OnPlayerOverlapProcess [this.player]: " +  JSON.stringify(this.player));
                console.log("!!!OnPlayerOverlapProcess [portal]: " +  JSON.stringify(portal));
            
                if(
                    //player.roomChange == true ||
                    portal.suspend == true
                ){
                    return;
            
                } else {
                    console.log("!!!OnPlayerOverlapProcess!!!");
                    //return true;
                }
            }
            //OnPlayerOverlapProcess,
            //this
        );


        console.log("INIT COLLIDERS");
        var portalsArray = this.portals.getChildren();

        console.log("PORTALS count: " + portalsArray.length);

        
        for(var i = 0; i < portalsArray.length; i++){
            var currChild = portalsArray[i];
            console.log("CURR CHILD: " + JSON.stringify(currChild));

            //currChild.InitializeCollider();


        }
        


    }


    ChangeMap = (player, portal) => {

        this.player.roomChange = true;

        var targetPortalID = portal.portalLink;
        var targetPortal = Portals.GetPortalByID(targetPortalID, this.portals.getChildren());
        var targetRoom = Rooms.GetRoomByID(targetPortal.room, this.rooms);

        this.LoadRoom(targetRoom, targetPortal);

        this.data.prevPortal = this.data.currPortal;
        this.data.currPortal = targetPortal;

        this.data.prevRoom = this.data.currRoom;
        this.data.currRoom = targetRoom;


    }

    LoadRoom = (roomObj, portalObj = null) => {
        console.log("LOAD ROOM");
        this.player.currentRoom = roomObj.id;

        if(portalObj != null){
            this.player.x = portalObj.x;
            this.player.y = portalObj.y;

            //OnLoadRoom(portalObj);
        }

    }

    OnLoadRoom = (targetPortal) => {

        console.log("target portal: " + JSON.stringify(this.data.currPortal));

        this.cameras.main.setBounds(
            this.data.currRoom.x,
            this.data.currRoom.y,
            this.data.currRoom.width,
            this.data.currRoom.height,
            true
        );
        
        
        /*
        this.cameras.main.setViewport(
            targetRoom.x,
            targetRoom.y,
            500,
            500
        );
        */

        this.player.onStairs = false;
        this.data.currPortal.suspend = true;


    }


}