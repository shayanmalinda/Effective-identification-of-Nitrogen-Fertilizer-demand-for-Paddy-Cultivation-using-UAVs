export class LCCWeekDetails {
    week: number;
    levelTwo: number;
    levelThree: number;
    levelFour: number;
}

export class LCCMainDetails {
    userID : string;
    division : string;
    weekDetails : LCCWeekDetails[];
}
