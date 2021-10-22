

export default class Player extends Phaser.GameObjects.Sprite {

    
    /**
     * Create the player.
     * @param {object} scene - scene creating the player.
     * @param {number} x - Start location x value.
     * @param {number} y - Start location y value.
     * @param {number} [frame] -
     */
    constructor(scene, x, y, frame) {
        super(scene, x, y, frame);


        console.log("CREATE PLAYER");

        this.scene = scene;
        this.currentRoom = 1;   
        this.previousRoom = null;
        this.roomChange = false;
        this.canMove = true;
        this.name = "player";
        this.depth = 20;

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.body.setCollideWorldBounds(true);
        //this.body.setOffset(7, 16);
        //this.body.setCircle(3);

        this.keys = scene.input.keyboard.addKeys('W,S,A,D,UP,LEFT,RIGHT,DOWN,SPACE');

        this.lastAnim = null;﻿
        this.vel = 200;
        this.onStairs = false;
        this.direction = 'down';

        /*
        config = {
            key: 'stand-down',
            frames: scene.anims.generateFrameNumbers('player', {start: 0, end: 0}),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        config = {
            key: 'stand-right',
            frames: scene.anims.generateFrameNumbers('player', {start: 4, end: 4}),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        config = {
            key: 'stand-up',
            frames: scene.anims.generateFrameNumbers('player', {start: 8, end: 8}),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);


        var config = {
            key: 'walk-down',
            frames: scene.anims.generateFrameNumbers('player', {start: 0, end: 3}),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        var config = {
            key: 'walk-right',
            frames: scene.anims.generateFrameNumbers('player', {start: 4, end: 7}),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        var config = {
            key: 'walk-up',
            frames: scene.anims.generateFrameNumbers('player', {start: 8, end: 11}),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);
        */

    }

    /**
     * Called before Update.
     * @param {object} time
     * @param {number} delta
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // movement and animation
        this.body.setVelocity(0);
        let animationName = null;

        
        // standing
        let currentDirection = this.direction;
        if (this.direction === 'left') { currentDirection = 'right'; } //account for flipped sprite
        animationName ﻿= 'stand-' + currentDirection;

        // all the ways the player can move.
        let left  = this.keys.A.isDown || this.keys.LEFT.isDown  || this.scene.gamepad && this.scene.gamepad.left;
        let right = this.keys.D.isDown || this.keys.RIGHT.isDown || this.scene.gamepad && this.scene.gamepad.right;
        let up    = this.keys.W.isDown || this.keys.UP.isDown    || this.scene.gamepad && this.scene.gamepad.up;
        let down  = this.keys.S.isDown || this.keys.DOWN.isDown  || this.scene.gamepad && this.scene.gamepad.down;

        if (this.canMove) {
            // moving
            if (left) {
                this.direction = 'left';
                this.body.setVelocityX(-this.vel);
                animationName = "walk-right";
                this.setFlipX(true);
            } else if (right) {
                this.direction = 'right';
                this.body.setVelocityX(this.vel);
                animationName = "walk-right";
                this.setFlipX(false);
            }

            if (up) {
                this.direction = 'up';
                this.body.setVelocityY(-this.vel);
                animationName = 'walk-up';
            } else if (down) {
                this.direction = 'down';
                this.body.setVelocityY(this.vel);
                animationName = 'walk-down';
            }
           
        }

        // Stairs
        if (this.onStairs) {
            console.log("suspend move")
            this.vel = 50;
            this.canMove = false;
            this.onStairs = false;
        } else {
            this.vel = 200;
        }

        // diagnoal movement
        this.body.velocity.normalize().scale(this.vel);

        // Check for room change.
        //this.getRoom();
        
    }


    update ()
    {

        console.log("PLAYER UPDATE");
        this.setVelocity(0);

        if (cursors.left.isDown)
        {
            this.setVelocityX(-200);
        }
        else if (cursors.right.isDown)
        {
            this.setVelocityX(200);
        }

        if (cursors.up.isDown)
        {
            this.setVelocityY(-200);
        }
        else if (cursors.down.isDown)
        {
            this.setVelocityY(200);
        }
    }

    Port = () => {

    }
    


}