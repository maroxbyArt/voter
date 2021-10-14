
export default class Utils {

    static GetPropertyByName = (propertyName, objectProps) => {

        console.log("UTIL PROP NAME: " + propertyName);
        

        for(var i = 0; i < objectProps.length; i++){
            var prop = objectProps[i];

            console.log("UTIL PROP CHECK [prop]: " +  JSON. stringify(prop));
            console.log("UTIL PROP CHECK [prop]: " +  (prop.name == propertyName));

            if(prop.name == propertyName)
                return prop.value;

        }

        console.log("Property [" + propertyName +"] not found.");
        return null;


    }

}