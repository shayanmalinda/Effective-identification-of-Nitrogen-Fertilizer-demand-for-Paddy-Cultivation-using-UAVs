export class LCCWeekDetails {
    week: number;
    levelOne: string;
    levelTwo: number;
    levelThree: string;
}

export class LCCMainDetails {
    userID : string;
    division : string;
    weekDetails : LCCWeekDetails[];
}
