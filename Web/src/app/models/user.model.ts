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
    status:string;
    image : string;             //to store the image of the user as base64 string
    registeredDate : string;
    createdDate : string;
    createdTimestamp : number;
    modifiedDate : string;
    modifiedTimestamp : number;
}

export class UserCredential {
    userID : string;
    email : string;
    password : string;
}

export class UserTemp{
    user:User;
    id:string
}
