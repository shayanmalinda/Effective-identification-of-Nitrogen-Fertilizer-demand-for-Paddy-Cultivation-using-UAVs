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
    image : string;             //to store the image of the user as base64 string
    status : string;            //to store the status of the user
    registeredDate : string;
}

export class UserCredential {
    userID : string;
    email : string;
    password : string;
}
