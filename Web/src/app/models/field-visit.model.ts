import { Field } from "./field.model";

export class FieldVisit {
    // id: string;
    date: string;
    division: string;
    fieldId: string;
    field: any;
    latitude: string;
    longitude: string;
    requestNote: string;
    status: string;
    address: string;
    farmer: any;
    farmerName: string;
    farmerTel: string;
    registrationNo: string;

}
export class FieldVisitTemp {
    id: string;
    fieldVisit: FieldVisit;
}
