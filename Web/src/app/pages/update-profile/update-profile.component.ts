import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from 'app/components/components.module';
import { User, UserCredential } from 'app/models/user.model';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';
import divisionalDataFile from '../../../assets/jsonfiles/divisions.json';
import { SelectorListContext } from '@angular/compiler';
import { Message } from 'app/models/message.model';
import { DialogService } from 'app/services/dialog.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  user: User = {
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    userRole: '',
    district: '',
    division: '',
    province: '',
    image: '',
    status: '',
    registeredDate: '',
    createdDate: '',
    createdTimestamp: 0,
    modifiedDate: '',
    modifiedTimestamp: 0,
  };

  userCredential: UserCredential = {
    email: '',
    password: '',
    userID: '',
  };

  message: Message = {
    title: '',
    showMessage: ''
  }

  cardImageBase64: string;
  fullName: string;
  location: string;
  divisionalData = divisionalDataFile;
  provinces = this.divisionalData.provinces;
  districts: any;
  divisions: any;
  provinceSelected: string;
  districtSelected: string;
  divisionSelected: string;

  constructor(private datepipe : DatePipe, private userService: UserService, private router: Router, private dialog: DialogService, private authentication : AuthenticationService) { }

  ngOnInit(): void {
    this.loadSessionDetails();
    console.log(this.user.firstName + " " + this.user.lastName);
    if (this.user.firstName == "" && this.user.lastName == "") {
      this.fullName = "Full name";
    } else {
      this.fullName = this.user.firstName + " " + this.user.lastName;
    }



  }

  processFile(imageInput: any) {

    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      const image = new Image();
      image.src = event.target.result;

      if ((file.type == 'image/png') || (file.type == 'image/jpeg') || (file.type == 'image/jpg')) {
        const imgBase64Path = event.target.result;
        this.user.image = imgBase64Path;
      } else {
        // console.log("This is not the relevant type");
        //error msg
      }
    });
    reader.readAsDataURL(file);
  }

  onSaveClick() {
    const currentTime = new Date;
    this.user.userRole = this.user.userRole.toLowerCase();
    this.user.modifiedTimestamp = currentTime.getTime();
    this.user.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
    this.userService.saveUserDetails(this.userCredential, this.user)
      .then(res => {
        this.message.title = "success";
        this.message.showMessage = "You have successfully updated the user details !";
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          this.updateSessionDetails();
          if (this.user.userRole != "admin")
            this.router.navigate(['/profile']);
        });
      }, err => {
        this.message.title = "error";
        this.message.showMessage = err;
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          this.clearFields();
        })
      });
  }

  onSkipClick() {
    this.message.title = "warning";
    this.message.showMessage = "The changes you have done not be applied to the profile !";
    this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
      this.router.navigate(['/profile']);
    });
  }

  loadSessionDetails() {
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
    this.user.createdDate = (sessionStorage.getItem("createdDate") != "" ? sessionStorage.getItem("createdDate") : "");
    this.user.createdTimestamp = parseInt((sessionStorage.getItem("createdTimestamp") != "" ? sessionStorage.getItem("createdTimestamp") : ""));
    this.user.modifiedDate = (sessionStorage.getItem("modifiedDate") != "" ? sessionStorage.getItem("modifiedDate") : "");
    this.user.modifiedTimestamp = parseInt((sessionStorage.getItem("modifiedTimestamp") != "" ? sessionStorage.getItem("modifiedTimestamp") : ""));
    this.user.registeredDate = (sessionStorage.getItem("registeredDate") != "" ? sessionStorage.getItem("registeredDate") : "");
    this.user.image = (sessionStorage.getItem("image") != "" ? sessionStorage.getItem("image") : "./assets/img/faces/user_profile_default.jpg");
    this.provinceSelected = sessionStorage.getItem('province');
    this.loadDistrictSelected(this.provinceSelected);
    this.districtSelected = sessionStorage.getItem('district');
    this.loadDivisionSelected(this.districtSelected);
    this.divisionSelected = sessionStorage.getItem('division');
  }

  onLogoutClick(){
    this.authentication.logOut();
    this.router.navigate(['/signup']);
    console.log(" finaly logs out !! ");
  }

  updateSessionDetails() {
    sessionStorage.setItem('email', this.user.email);
    sessionStorage.setItem('firstName', this.user.firstName);
    sessionStorage.setItem('lastName', this.user.lastName);
    sessionStorage.setItem('nic', this.user.nic);
    sessionStorage.setItem('phone', this.user.phone);
    sessionStorage.setItem('userRole', this.user.userRole);
    sessionStorage.setItem('district', this.user.district);
    sessionStorage.setItem('division', this.user.division);
    sessionStorage.setItem('province', this.user.province);
    sessionStorage.setItem('image', this.user.image);
    sessionStorage.setItem('createdTimestamp', this.user.createdTimestamp.toString());
    sessionStorage.setItem('createdDate', this.user.createdDate);
    sessionStorage.setItem('modifiedDate', this.user.modifiedTimestamp.toString());
    sessionStorage.setItem('modifiedTimestamp', this.user.modifiedDate);
    sessionStorage.setItem('registeredDate', this.user.registeredDate);
  }

  nameChanged() {
    this.fullName = this.user.firstName + " " + this.user.lastName;
  }

  loadDistrictSelected(value: any) {
    var province = value.toString();
    this.districts = this.divisionalData["" + province + ""]
  }

  loadDivisionSelected(value: any) {
    var district = value.toString();
    this.divisions = this.divisionalData["" + district + ""]
  }

  onProvinceSelected(value: any) {
    var province = value.toString();
    this.user.province = province;
    this.districts = this.divisionalData["" + province + ""];
    this.districtSelected = this.divisionalData["" + province + ""][0];
    this.divisions = this.divisionalData["" + this.districtSelected + ""];
    this.divisionSelected = this.divisionalData["" + this.districtSelected + ""][0];
    this.user.district = this.districtSelected;
    this.user.division = this.divisionSelected;
  }

  onDistrictSelected(value: any) {
    var district = value.toString();
    this.user.district = district;
    this.divisions = this.divisionalData["" + district + ""];
    this.divisionSelected = this.divisionalData["" + district + ""][0];
    this.user.division = this.divisionSelected;
  }

  onDivisionSelected(value: any) {
    var division = value.toString();
    this.user.division = division;
  }

  clearFields() {
    this.userCredential.email = "";
    this.userCredential.password = "";
    this.user.firstName = "";
    this.user.lastName = "";
    this.districtSelected = undefined;
    this.divisionSelected = undefined;
    this.provinceSelected = undefined;
    this.user.nic = "";
    this.user.userRole = "";
    this.user.phone = "";
  }

  onLccDetailsClick() {
    this.updateSessionDetails();
    this.router.navigate(['/lcc-details']);
  }

  onDashboardClick() {
    this.updateSessionDetails();
    this.router.navigate(['/user-dashboard']);
  }
}
