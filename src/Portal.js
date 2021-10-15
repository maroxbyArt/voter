import Utils from 'Utils.js'


export default class Portal extends Phaser.GameObjects.Sprite {

    
    /**
     * Create the player.
     * @param {object} scene - scene creating the player.
     * @param {number} x - Start location x value.
     * @param {number} y - Start location y value.
     * @param {number} [frame] -
     */
    constructor(scene, x, y, tileObj) {
        super(scene, x, y);
        this.scene = scene;

        this.tileObj = tileObj;
        this.id =  tileObj.id;
        this.name = tileObj.name;
        //this.name = tileObj.name;

        console.log("PORAL INIT: " + JSON.stringify(tileObj));

        this.room = Utils.GetPropertyByName("room", tileObj.properties);
        this.suffix = Utils.GetPropertyByName("suffix", tileObj.properties);
        this.portalLink = Utils.GetPropertyByName("portal_link", tileObj.properties);
        this.suspend = Utils.GetPropertyByName("suspend", tileObj.properties);

        this.on("overlapend", function() {
            console.log("OVERLAP END");
            if(this.suspend == true)
                this.suspend = false;
          });

    }
}
