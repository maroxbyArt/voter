import Utils from 'Utils.js'


export default class Portal extends Phaser.Physics.Arcade.Sprite {

    
    /**
     * Create the player.
     * @param {object} scene - scene creating the player.
     * @param {number} x - Start location x value.
     * @param {number} y - Start location y value.
     * @param {number} [frame] -
     */
    constructor(scene, x, y, tileObj) {
        super(scene, x, y);

        scene.events.on('update', this.update)
        //console.log(this.scene.game);
        scene.add.existing(this);

        //this.scene = scene;

        this.tileObj = tileObj;
        this.id =  tileObj.id;
        this.name = tileObj.name;
        //this.name = tileObj.name;


        this.room = Utils.GetPropertyByName("room", tileObj.properties);
        this.suffix = Utils.GetPropertyByName("suffix", tileObj.properties);
        this.portalLink = Utils.GetPropertyByName("portal_link", tileObj.properties);
        
        this.suspend = Utils.GetPropertyByName("suspend", tileObj.properties);
        this.occupied = false

        //this.Initialize();


        //this.scene.portals.add.existing(this);
        

    }

    OnPlayerOccupied = () => {
        this.occupied = true;


    }

    update = () => {
        //console.log("PORTAL UPDATE");
        
        if(this.occupied)
            console.log("PLAYER OCCUPIED: " + JSON.stringify(this));
            

    }
    
}
