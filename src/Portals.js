
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

    static GetPortalByName = (name, portals) => {

        console.log("Portals [count]: " + portals.length);
        console.log("TARGET Name: " + name);

        for(var i = 0; i < portals.length; i++){
            let currPortal = portals[i];
            console.log("CURR PORTAL SEARCH: " + JSON.stringify(currPortal));
            console.log("CURR PORTAL SEARCH [name]: " + JSON.stringify(currPortal.name));

            if(name == currPortal.name)
                return currPortal;

        }

        console.log("Portal [" + name +"] not found.");
        return null;


    }



}