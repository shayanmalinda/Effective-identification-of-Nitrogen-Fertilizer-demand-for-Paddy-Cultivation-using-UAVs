import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Message } from 'app/models/message.model';
import { User, UserCredential, UserTemp } from 'app/models/user.model';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { DialogService } from 'app/services/dialog.service';
import { Router } from '@angular/router';
import { UserFarmersService } from 'app/services/user-farmers.service';
import { FieldService } from 'app/services/field.service';
import { Field } from 'app/models/field.model';
import { UserService } from 'app/services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

const NO_OF_WEEKS = 8;

@Component({
  selector: 'app-user-farmers',
  templateUrl: './user-farmers.component.html',
  styleUrls: ['./user-farmers.component.css']
})
export class UserFarmersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  user : User  = {
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    userRole: '',
    district: '',
    division: '',
    province: '',          
    image : '',      
    status : '',  
    registeredDate : '',
    createdDate: '',
    createdTimestamp: 0,
    modifiedDate: '',
    modifiedTimestamp : 0,
  };

  userTemp : UserTemp  = {
    id : '',
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    userRole: '',
    district: '',
    division: '',
    province: '',          
    image : '',      
    time : '',
    status : '',  
    registeredDate : '',
  };

  userCredential : UserCredential = {
    email : '',
    password : '',
    userID : '',
  };

  message : Message = {
    title : '',
    showMessage : ''
  }

  users : User [];

  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails : LCCMainDetails;
  havePreviousRecords : boolean = false;
  approved = 0;
  declined = 0;
  pending = 0;
  all = 0;
  fields : Field [];
  passedUser : User;
  framersWithFields;
  testingFields = [];
  loading = true;

  displayedColumns: string[] = ['firstName', 'lastName', 'address', 'phone' ];
  dataSource : MatTableDataSource<User>;

  constructor(private fireStore : AngularFirestore, private userFarmersService : UserFarmersService, private dialog : DialogService, private fieldService : FieldService, private userService : UserService, private router : Router) { }

  ngOnInit(): void {
    this.loadSessionDetails();
    // this.getFarmerDetails();
    // this.getFarmerDetailsWithFields();

    //this is the relevant method
    // this.getFarmerDetailsWithFieldsNew();
    this.getFarmerDetailsWithFieldsTesting();


    // this.dataSource = new MatTableDataSource(this.changedWeekDetails);
    // setTimeout(() => this.dataSource.paginator = this.paginator);
    // setTimeout(() => this.dataSource.sort = this.sort);
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue : string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(row){
    var weekNo = row.week;
    var rowDetails = row;
    this.changedWeekDetails[weekNo - 1] = rowDetails;
  }

  loadSessionDetails(){
    this.userCredential.userID = sessionStorage.getItem('userID');
    this.user.status = sessionStorage.getItem('status');
    this.user.firstName = (sessionStorage.getItem("firstName") != "" ? sessionStorage.getItem("firstName") : "");
    this.user.lastName = (sessionStorage.getItem("lastName") != "" ? sessionStorage.getItem("lastName") : "");
    this.user.nic = (sessionStorage.getItem("nic") != "" ? sessionStorage.getItem("nic") : "");
    this.user.email = (sessionStorage.getItem("email") != "" ? sessionStorage.getItem("email") : "");
    this.user.userRole = (sessionStorage.getItem("userRole") != "" ? sessionStorage.getItem("userRole") : "");
    this.user.phone = (sessionStorage.getItem("phone") != "" ? sessionStorage.getItem("phone") : "");
    this.user.division = (sessionStorage.getItem("division") != "" ? sessionStorage.getItem("division") : "");
    this.user.district = (sessionStorage.getItem("district") != "" ? sessionStorage.getItem("district") : "");
    this.user.province = (sessionStorage.getItem("province") != "" ? sessionStorage.getItem("province") : "");
    this.user.image = (sessionStorage.getItem("image") != "" ? sessionStorage.getItem("image") : "./assets/img/faces/user_profile_default.jpg");
  }

  updateWeekDetails(){
    for(var i = 0; i < NO_OF_WEEKS; i++ ){
      var j = i;
      if(this.changedWeekDetails[i] == undefined){
        this.changedWeekDetails[i] = {week: j+1, levelFour: 0, levelTwo: 0, levelThree: 0}
      }else{
        if(this.changedWeekDetails[i].levelFour == 0){
          this.changedWeekDetails[i].levelFour = 0;
        }if(this.changedWeekDetails[i].levelTwo == 0){
          this.changedWeekDetails[i].levelTwo = 0;
        }if(this.changedWeekDetails[i].levelThree == 0){
          this.changedWeekDetails[i].levelThree = 0;
        }
      } 
    }
  }

  getFarmerDetails(){
    this.user.division = sessionStorage.getItem('division');
    this.userFarmersService.getAllFarmersByDivion(this.user).subscribe(
      data => {
        this.users = data.map(e => {
          return {
            ...e.payload.doc.data() as {}
          } as User;
        })
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getCounts();
      }
    )
  }

  getFarmerDetailsWithFields(){
    var fieldsWithFarmer = [];
    var fields;
    var farmer;
    this.fieldService.getFieldsByDivision(this.user).subscribe(data => {
      fields = data.map(e => {
        return {
          // id: e.payload.doc.id, 
          ...e.payload.doc.data() as {}
        } as Field;
      })
      fields.forEach(f => {
        this.all ++;
        this.userService.getUser(f.farmerId).subscribe(data => {
          farmer = data.payload.data() as User;
          // f.farmer = farmer.firstName + " " + farmer.lastName;
          fieldsWithFarmer.push({
            address : f.address, 
            registrationNumber : f.registrationNumber,
            firstName : farmer.firstName,
            lastName : farmer.lastName,
            phone : farmer.phone,
            email : farmer.email,
            nic : farmer.nic,
            fullName : farmer.firstName + " " + farmer.lastName
          });
          console.log(fieldsWithFarmer);
          this.dataSource = new MatTableDataSource(fieldsWithFarmer);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      })
      // console.log(fieldWithFarmer)
    });
  }

  getFarmerDetailsWithFieldsNew(){
    var fieldsWithFarmer = [];
    var field = [];
    var farmers;
    var values;
    var credentials : UserCredential = {
      userID : '',
      email : '',
      password : ''
    }
    this.userFarmersService.getAllFarmers().subscribe(data =>{
      farmers = data.map(e =>{
        return {
          id : e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as UserTemp;
      })
      farmers.forEach(element => {
        credentials.userID = element.id;
        console.log("the id is here : " + element.id);
        this.fieldService.getFieldsByFarmerId(credentials).subscribe(data =>{
          // console.log(data.length);
          field = data.map(e =>{
            // console.log(e.payload.doc.data())
            return {
              // id : e.payload.doc.id, //
              ...e.payload.doc.data() as {}
            } as Field
          })
          // console.log("number records : " + field.length)
          for(var i = 0; i < field.length; i++){
            this.all ++;
            if(field[i].division == this.user.division){
              fieldsWithFarmer.push({
                details : field[i].id,
                address : field[i].address,
                registrationNumber : field[i].registrationNumber,
                firstName : element.firstName,
                lastName : element.lastName,
                phone : element.phone,
                email : element.email,
                nic : element.nic,
                fullName : element.firstName + " " + element.lastName
              });
            }
          }
          // console.log(fieldsWithFarmer)
          this.dataSource = new MatTableDataSource(fieldsWithFarmer);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      });
    })
  }

  getFarmerDetailsWithFieldsTesting(){
    var credentials : UserCredential = {
      userID : '',
      email : '',
      password : ''
    }
    // this.all = 1;
    this.fireStore.collection('FieldDetails', ref => ref.where('division', '==', this.user.division)).snapshotChanges().subscribe(
      data => {
        this.all = data.length;
        console.log(data.length);
        var i = 0;
        var field = data.map(e =>{
          // console.log(e.payload.doc.data())
          console.log(e.payload.doc.get("farmerId"))
          credentials.userID = e.payload.doc.get("farmerId");
          var farmers = this.fireStore.collection('Users').doc(credentials.userID).snapshotChanges().subscribe(
            res => {
              console.log(res.payload.get("firstName"))
              console.log(res.payload.get("lastName"))
              console.log(res.payload.get("email"))
              console.log(res.payload.get("nic"))
              console.log(res.payload.get("phone"))
              this.testingFields.push({
                details : e.payload.doc.get("id"),
                address : e.payload.doc.get("address"),
                registrationNumber : e.payload.doc.get("registrationNumber"),
                firstName : res.payload.get("firstName"),
                lastName : res.payload.get("lastName"),
                phone : res.payload.get("phone"),
                email : res.payload.get("email"),
                nic : res.payload.get("nic"),
                fullName : res.payload.get("firstName") + " " + res.payload.get("lastName")
              })
              i++;
              if(i == data.length){
                console.log(this.testingFields)
                this.dataSource = new MatTableDataSource(this.testingFields);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
              // this.testingFields.push(res.payload.get("nic"))
              // this.testingFields.push(res.payload.get("firstName"))
              // this.testingFields.push(res.payload.get("lastName"))
              // this.testingFields.push(res.payload.get("email"))
              // this.testingFields.push(res.payload.get("phone"))
              // return res.payload.get("phone") as string;
              // framersWithFields.push({
              //   details : e.payload.doc.get("id"),
              //   address : e.payload.doc.get("address"),
              //   registrationNumber : e.payload.doc.get("registrationNumber"),
              //   firstName : res.payload.get("firstName"),
              //   lastName : res.payload.get("lastName"),
              //   phone : res.payload.get("phone"),
              //   email : res.payload.get("email"),
              //   nic : res.payload.get("nic"),
              //   fullName : res.payload.get("firstName") + " " + res.payload.get("lastName")
              // })
            }
          )
          // console.log(farmers)
          // console.log(this.testingFields)
          return {
            // id : e.payload.doc.id, //
            ...e.payload.doc.data() as {}
          } as Field
        })
        // console.log(field);
        // console.log(this.testingFields)
        // this.dataSource = new MatTableDataSource(this.testingFields);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.loading = false;
      }
    )
  }

  // getFarmerDetailsWithFieldsNew(){
  //   var fieldsWithFarmer = [];
  //   var field;
  //   var farmers;
  //   console.log("this is the division : " + this.user.division);
  //   this.userFarmersService.getAllFarmersByDivion(this.user).subscribe(data => {
  //     farmers = data.map(e => {
  //       return {
  //         id: e.payload.doc.id,
  //         ...e.payload.doc.data() as {}
  //       } as User;
  //     })
  //     farmers.forEach(f => {
  //       console.log(f.firstName);
  //       this.fieldService.getFieldsByFarmerId(this.userCredential).subscribe(data => {
  //         field = data.map(e => {
  //           return {
  //             id: e.payload.doc.id,
  //             ...e.payload.doc.data() as {}
  //           } as Field;
  //         // f.farmer = farmer.firstName + " " + farmer.lastName;
          
  //         });
  //         fieldsWithFarmer.push({
  //           address : f.address, 
  //           registrationNumber : f.registrationNumber,
  //           firstName : farmers.firstName,
  //           lastName : farmers.lastName,
  //           phone : farmers.phone,
  //           email : farmers.email,
  //           nic : farmers.nic,
  //           fullName : farmers.firstName + " " + farmers.lastName
  //         });
  //         console.log(fieldsWithFarmer);
  //         this.dataSource = new MatTableDataSource(fieldsWithFarmer);
  //         this.dataSource.paginator = this.paginator;
  //         this.dataSource.sort = this.sort;
  //       });
  //     })
  //     // console.log(fieldWithFarmer)
  //   });
  // }

  getCounts() {
    this.users.forEach(data => {
      if (data.status == 'pending') {
        this.pending++;
      }else if (data.status == 'declined') {
        this.declined++;
      } else {
        this.approved++;
      }
    });
    this.all = this.declined + this.pending + this.approved;
  }

  onClick(row){
    console.log(row);
    // this.message.showMessage = "You have entered invalid password !";
    // this.message.title = 'success';
    // console.log(this.message);
    this.dialog.openDetailsDialog(row,"farmerDetails").afterClosed();
  }

}
