
export default class Room {

    constructor(roomObj) {
        
        this.raw = roomObj;

        this.name = roomObj.name;
        this.id = roomObj.id;
        this.x = roomObj.x;
        this.y = roomObj.y;
        this.width = roomObj.width;
        this.height = roomObj.height;

        this.properties = roomObj.properties;

        console.log("NEW ROOM OBJ: " + JSON.stringify(roomObj));

        this.Initialize();

    }

    Initialize = () => {

    }

}