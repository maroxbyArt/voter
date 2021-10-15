import Portal from 'Portal.js'
import Room from 'Room.js'


export default class SceneData {

    constructor(scene) {
        
        this.scene = scene;
        this.map = scene.map;

        //this.rooms = [];
        //this.portals = scene.physics.add.group();

        this.Initialize();

    }

    Initialize = () => {
        this.ParsePortalData();
        this.ParseRoomData();

    }


    GetPortalByID(id){
        array.forEach(e => {
            if(e.id == id)
                return e;
        });

        console.log("Portal [" + id +"] not found.");
    }

    ParsePortalData = () => {

        this.map.findObject('Portal', function(object) {
            this.scene.portals.add(
                new Portal(this.scene, object.x, object.y, object)
            );

        }, this);

    }

    ParseRoomData = () => {
        this.map.findObject('Rooms', function(object) {

            var newRoom = new Room(object);
            this.scene.rooms.push(newRoom);

        }, this);

    }



}

