const WorldsEnum = Object.freeze(
    {
        "HOME":1, 
    }
)

const HomeJourneyEnum = Object.freeze(
    {
        "EXPLORE": 1,
        "MEET_OAK": 2,
        "GET_ID": 3,
        "SPEAK_TO_MOTHER": 4, 
        "LEAVE": 5    
    }
)

const HomeItemsEnum = Object.freeze(
    {
        "ID": 1, 
    }
)

var HOME_JOURNEY = {
    key: WorldsEnum.HOME,
    inventory: [],
    journey: [
        {
            key: HomeJourneyEnum.EXPLORE,
            reqItems: [],
            helpCopy: ""
        },
        {
            key: HomeJourneyEnum.MEET_OAK,
            reqItems: [],
            helpCopy: ""
        },
        {
            key: HomeJourneyEnum.GET_ID,
            reqItems: [],
            helpCopy: ""
        },        
        {
            key: HomeJourneyEnum.SPEAK_TO_MOTHER,
            reqItems: [HomeItemsEnum.ID],
            helpCopy: ""
        },
        {
            key: HomeJourneyEnum.LEAVE,
            reqItems: [HomeItemsEnum.ID],
            helpCopy: ""
        },

    ]
}



var JOURNEY = [
    {
        key: WorldsEnum.HOME,
        data: HOME_JOURNEY,
    }
]

Object.freeze(JOURNEY)


export default class State {
    constructor(height, width) {
      this.height = height;
      this.width = width;

      this.worlds = WorldsEnum;
      this.journey = JOURNEY;

    }


  }

  