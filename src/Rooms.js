
export default class Rooms {

    static GetRoomByID = (id, rooms) => {

        for(var i = 0; i < rooms.length; i++){
            let currRoom = rooms[i];
            
            if(id == currRoom.id)
                return currRoom;

        }

        console.log("Room [" + id +"] not found.");
        return null;


    }

    static GetRoomByName = (name, rooms) => {

        console.log("TARGET Name: " + name);

        for(var i = 0; i < rooms.length; i++){
            let currRoom = rooms[i];
            if(name == currRoom.name)
                return currRoom;

        }

        console.log("Room [" + name +"] not found.");
        return null;


    }

    static ChangeRoom = () => {
        
    }

}