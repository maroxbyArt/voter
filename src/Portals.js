
export default class Portals {

    static GetPortalByID = (id, portals) => {

        console.log("Portals [count]: " + portals.length);
        console.log("TARGET ID: " + id);

        for(var i = 0; i < portals.length; i++){
            let currPortal = portals[i];
            console.log("CURR PORTAL SEARCH: " + JSON.stringify(currPortal));
            console.log("CURR PORTAL SEARCH [id]: " + JSON.stringify(currPortal.id));

            if(id == currPortal.id)
                return currPortal;

        }

        console.log("Portal [" + id +"] not found.");
        return null;


    }



}