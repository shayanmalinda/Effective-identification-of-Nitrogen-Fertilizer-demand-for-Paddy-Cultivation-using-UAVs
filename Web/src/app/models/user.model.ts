export class User {
    email: string;
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    userRole: string;
    district: string;
    division: string;
    province: string;
    status: string;
    image: string;             //to store the image of the user as base64 string
    registeredDate: string;
    createdDate: string;
    createdTimestamp: number;
    modifiedDate: string;
    modifiedTimestamp: number;
}

export class UserCredential {
    userID: string;
    email: string;
    password: string;
}

export class UserTemp {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    userRole: string;
    district: string;
    division: string;
    province: string;
    time: String;
    status: string;
    image: string;             //to store the image of the user as base64 string
    registeredDate: string;
}

export class Counts {
    key: string;
    value: number;
}
export class Counts2 {
    key: string;
    value: number[];
}
export class CountsVisit {
    key: string;
    processing: number;
    completed: number;
    total: number;
}
export class CountsReq {
    key: string;
    pending: number;
    confirmed: number;
    declined: number;
    processing: number;
    completed: number;
    total:number;

}