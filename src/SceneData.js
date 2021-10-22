import Portal from 'Portal.js'
import Room from 'Room.js'


export default class SceneData {

    constructor(scene) {
        
        this.scene = scene;
        this.map = scene.map;

        //this.rooms = [];
        //this.portals = scene.physics.add.group();
        this.currPortal;
        this.prevPortal;

        this.currRoom;
        this.prevRoom;

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
            console.log("BASE PORTAL OBJ: " + JSON.stringify(object))
            var newPortal = new Portal(this.scene, object.x, object.y, object);

            this.scene.portals.add(
                newPortal
            );

            //newPortal.data = Object.create();
            newPortal.setData("properties", object.properties);
            newPortal.setData("properties", object.properties);

            //newPortal.data.object["properties"] = object.properties;
            //newPortal.data["properties"] = object.properties;
            console.log("BASE PORTAL OBJ [newPortal]: " + JSON.stringify(newPortal.getData("properties")));


        }, this);

        //this.scene.portals.refresh();


    }

    ParseRoomData = () => {
        this.map.findObject('Rooms', function(object) {

            var newRoom = new Room(object);
            this.scene.rooms.push(newRoom);

        }, this);

    }



}

