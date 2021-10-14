import Portal from 'Portal.js'


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

    GetPropertyByName(propertyName, baseObj){
        for (var i = 0; i < baseObj.propreties; i ++){
            if(baseObj.propreties.name == propertyName)
                return baseObj.propreties[i];
        }

        console.log("Property [" + propertyName +"] not found.");
        return null;


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

            console.log("Portal")
            console.log(object)

            this.scene.portals.add(
                new Portal(this.scene, object.x, object.y, object)
            );

        }, this);

    }

    ParseRoomData = () => {
        this.map.findObject('Rooms', function(object) {

            this.scene.rooms.push(object);

        }, this);

    }



}

/*

export default class Room {

    constructor(name) {
        this.name = name;
        this.portals = [];

    }

    ParsePortalData(portal){

    }

}



export default class MapData {



}
*/