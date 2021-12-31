export class LCCWeekDetails {
    week: number;
    levelOne: number;
    levelTwo: number;
    levelThree: number;
}

export class LCCMainDetails {
    userID : string;
    division : string;
    weekDetails : LCCWeekDetails[];
}
