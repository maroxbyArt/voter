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

        console.log("CREATE PORTAL");
    }
}
