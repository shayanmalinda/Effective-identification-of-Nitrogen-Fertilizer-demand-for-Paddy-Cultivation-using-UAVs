export class User {
    id:any;
    email: string;
    firstName: string;
    lastName: string;
    nic: string;
    phone: string;
    userRole: string;
    district: string;
    division: string;
    province: string;
    time:String;
    status:string;
    image : string;             //to store the image of the user as base64 string
    registeredDate : string;
}

export class UserCredential {
    userID : string;
    email : string;
    password : string;
}
