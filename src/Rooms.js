
export default class Rooms {

    static GetRoomByID = (rooms, id) => {

        for(var i = 0; i < rooms.length; i++){
            let currRoom = rooms[i];

            if(id == currRoom.id)
                return currRoom;

        }

        console.log("Room [" + id +"] not found.");
        return null;


    }

    static ChangeRoom = () => {
        
    }

}