import mapJSON from 'img/home.json';
import tilesSS from 'img/tiles.png';
import playerImg from 'img/playerGrid.png';
import Player from 'Player.js'
import Portal from 'Portal.js'
import SceneData from 'SceneData.js'

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
    /*
        console.log("PRELOAD");
        // Player sprite.
        
        this.load.spritesheet({
            key: 'player',
            url: playerImg,
            frameConfig: {frameWidth: 21,  //The width of the frame in pixels.
                          frameHeight: 26, //The height of the frame in pixels. Uses the frameWidth value if not provided.
                          startFrame: 0,   //The first frame to start parsing from.
                          endFrame: 12,    //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                          margin: 0,       //The margin in the image. This is the space around the edge of the frames.
                          spacing: 0}      //The spacing between each frame in the image.
        });
        */

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

                var roomLabel = "";
                var targetRoomObj = portal.tileObj;
                var targetRoomProps = targetRoomObj.properties;
                var targetRoom = this.getObjPropertyVal(targetRoomProps, "room")
                var targetRoomSuffix = this.getObjPropertyVal(targetRoomProps, "to_suffix")


                if(targetRoom != 'exit'){
                    roomLabel = targetRoom + targetRoomSuffix;
                    console.log("ROOM CHANGE: " + roomLabel);
                    console.log("ROOM SUFFIX: " + targetRoomSuffix);
                    console.log("ROOM PROPS: " + JSON.stringify(targetRoomProps));
                    
                }
            
                var roomIndex = this.getRoomIndex(roomLabel, this.rooms);
                this.player.currentRoom = roomIndex;
                this.player.roomChange = true;
                this.player.onStairs = true;


            }, 
            null, 
            this
        );

        // start camera
        this.cameras.main.setZoom(2.0);
        var mainRoomIndex = 0;

        for(var i = 0; i < this.rooms.length; i++){
            console.log("ROOMs");
            console.log(this.rooms[i].name);

            if(this.rooms[i].name === "main"){
                console.log("FOUND ROOM");
                mainRoomIndex = i;
            }
        };

        this.player.currentRoom = mainRoomIndex;


        // Set first room boundaries.
        this.cameras.main.setBounds(
            this.rooms[this.player.currentRoom].x,
            this.rooms[this.player.currentRoom].y,
            this.rooms[this.player.currentRoom].width,
            this.rooms[this.player.currentRoom].height,
            true
        );
        

        this.cameras.main.startFollow(this.player);


        // Listener for gamepad detection.
        this.input.gamepad.once('down', function (pad, button, index) {
            this.gamepad = pad;
        }, this);

        
        

    }

    /** Update called every tick. */
    update(time, delta) {

        /* Potential Phaser 3 bug: fade effects seem to be limited by the camera width and height
        (I'm gussing that is what _ch and _cw variabels are), these look like they are set by the
        game config width and height instead of the camera boundaries. I'm setting them to match the
        level so fade effects cover everwhere the camerea could possibly be. Moved from create so
        fade works after screen resize.
        Weird side note: with arcade physics debug on this doesn't seem to be a problem. */
        this.cameras.main._ch = this.map.heightInPixels;
        this.cameras.main._cw = this.map.widthInPixels;

        
        // On player room change, stop player movement, fade camerea, and set boundaries.

        if (this.player.roomChange && !this.isFading) {

            this.isFading = true;

            this.cameras.main.fadeOut(500, 0, 0, 0, function(camera, progress){                
                if(progress == 1){

                // Change camera boundaries when fade out complete.
                this.cameras.main.setBounds(
                    this.rooms[this.player.currentRoom].x,
                    this.rooms[this.player.currentRoom].y,
                    this.rooms[this.player.currentRoom].width,
                    this.rooms[this.player.currentRoom].height,
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

            /*
            this.cameras.main.fadeOut(250, 0, 0, 0, function(camera, progress) {
                this.player.canMove = false;
                if (progress === 1) {

                    console.log("ROOM CHANGE INDEX");
                    console.log(this.player.currentRoom);


                    // Change camera boundaries when fade out complete.
                    this.cameras.main.setBounds(
                        this.rooms[this.player.currentRoom].x,
                        this.rooms[this.player.currentRoom].y,
                        this.rooms[this.player.currentRoom].width,
                        this.rooms[this.player.currentRoom].height,
                        true
                    );

                    // Fade back in with new boundareis.
                    this.cameras.main.fadeIn(500, 0, 0, 0, function(camera, progress) {
                        if (progress === 1) {
                            this.player.canMove = true;
                            this.roomStart(this.player.currentRoom);
                        }
                    }, this);
                }
            }, this);
            */

        }
        

    }
    

    roomStart(roomNumber) {
        if (roomNumber == 4) {
            this.cameras.main.shake(2500, 0.001, true);
        }
    }

    getRoomIndex(roomName, rooms){

        var mainRoomIndex = 999;

        for(var i = 0; i < rooms.length; i++){
            console.log("ROOMs");
            console.log(rooms[i].name);
            console.log(roomName);

            if(rooms[i].name === roomName){
                mainRoomIndex = i;
            }
        };

        return mainRoomIndex;

    }
 
    
    getObjPropertyVal(objectProps, propertyName){
        for(var i = 0; i < objectProps.length; i++){
            var prop = objectProps[i];

            if(prop.name == propertyName)
                return prop.value;
        }

    }
}