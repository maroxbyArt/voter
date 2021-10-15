
export default class Utils {

    static GetPropertyByName = (propertyName, objectProps) => {    
        for(var i = 0; i < objectProps.length; i++){
            var prop = objectProps[i];
            if(prop.name == propertyName)
                return prop.value;

        }

        console.log("Property [" + propertyName +"] not found.");
        return null;


    }

}