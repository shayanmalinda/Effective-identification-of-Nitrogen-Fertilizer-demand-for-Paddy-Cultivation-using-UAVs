import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js'
import { User, UserCredential, UserTemp } from 'app/models/user.model';
import { UserFarmersService } from 'app/services/user-farmers.service';
import { FieldService } from 'app/services/field.service';
import { Field } from 'app/models/field.model';
import { FieldVisitService } from 'app/services/field-visit.service';
import { FieldVisitTemp } from 'app/models/field-visit.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  // public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // public doughnutChartData: MultiDataSet = [
  //   [250, 130, 70],
  // ];
  // public doughnutChartType: ChartType = 'doughnut';

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

  userCredential : UserCredential = {
    email : '',
    password : '',
    userID : '',
  };
  fieldVisits;
  farmersAll = 0;
  fieldsAll = 0;
  requestsAll = 0;
  visitsAll = 0;
  TotalRequests = 0;
  pendingRequests = 0;
  confirmedRequests = 0;
  declinedRequests = 0;
  completedRequests = 0;
  processingRequests = 0;
  pendingRequestsPrecentage = "0";
  confirmedRequestsPrecentage = "0";
  declinedRequestsPrecentage = "0";
  completedRequestsPrecentage = "0";
  processingRequestsPrecentage = "0";
  farmerRequestsSection = false;
  fieldVisitsSection = false;
  labelsForChartTwo = [];
  hiddenVisitAll = true;
  hiddenRequestAll = true;
  loading = true;

  constructor(private fireStore : AngularFirestore, private fieldVisitService : FieldVisitService, private router : Router, private userFarmersService : UserFarmersService, private fieldService : FieldService) { }

  ngOnInit(): void {

    console.log("begin");
    this.loadSessionDetails();
    // this.getFarmerDetailsWithFieldsNew();
    this.getFarmerDetailsWithFieldsTesting();
    // this.getFieldsDetailsWithFarmerNew();
    this.getFieldsDetailsWithFarmerTesting();
    // this.getVisitDetailsWithFields();
    this.getVisitDetailsWithFieldsTesting();
    // this.getVisitDetailsWithFieldsNew();
    this.getVisitDetailsWithFieldsPendingTesting();
    // this.getCalculations();
    // this.TotalRequests = this.requestsAll + this.visitsAll;
    // console.log(this.TotalRequests);
    

    // var ctx = document.getElementById('myChart')as HTMLCanvasElement;
//     var myChart = new Chart('myChart', {
//     type: 'bar',
//     data: {
//         labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//         datasets: [{
//             label: '# of Votes',
//             data: [12, 19, 3, 5, 2, 3],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.2)',
//                 'rgba(54, 162, 235, 0.2)',
//                 'rgba(255, 206, 86, 0.2)',
//                 'rgba(75, 192, 192, 0.2)',
//                 'rgba(153, 102, 255, 0.2)',
//                 'rgba(255, 159, 64, 0.2)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)',
//                 'rgba(153, 102, 255, 1)',
//                 'rgba(255, 159, 64, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         // scales: {
//         //     y: {
//         //         beginAtZero: true
//         //     }
//         // }
//     }
// });
  }

  // onProfileClick(){
  //   this.router.navigate(['/profile']);
  // }

  viewFields() {
    this.router.navigate(['/fields']);
  }
  viewUsers() {
    this.router.navigate(['/users'], { state: { role: 'user' } });
  }
  viewRequests() {
    this.router.navigate(['/requests'], { state: { role: 'user', type: 'request' } });
  }
  viewOfficerRequests() {
    this.router.navigate(['/officer-requests'], { state: { role: 'officer', type: 'request' } });
  }
  viewOfficers() {
    this.router.navigate(['/officers'], { state: { role: 'officer'} });
  }

  viewFieldVisits() {
    this.router.navigate(['/field-visits']);
  }

  onReportsButtonClick(){
    console.log("comes here ");
    this.router.navigate(['/user-reports'], { state : { type : "lcc" }});
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
            if(field[i].division == this.user.division){
              // this.farmersall ++;
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
          this.farmersAll = fieldsWithFarmer.length;
        })
      });
    })
  }

  getFieldsDetailsWithFarmerNew(){
    var fieldWithFarmer = [];
    this.fieldService.getFieldsByDivision(this.user).subscribe(data => {
      this.fieldsAll = (data.length > 0 ? data.length : 0);
    });
  }

  getVisitDetailsWithFieldsPendingTesting(){
    var fieldVisits;
    var relevantFields = [];
    var field;
    var farmer;
    this.completedRequests = 0;
    this.processingRequests = 0;
    console.log(this.user.division);
    var printable = false;
    
    this.fireStore.collection('FieldRequests', ref => ref.where('division', '==', this.user.division)).snapshotChanges().subscribe(
      data => {
        if(printable == false){
          printable = true;
          var i = 0;
          var fieldVisits = data.map(e => {
          // console.log(e.payload.doc.get('status'));
          var status = e.payload.doc.get('status');
          var fieldId = e.payload.doc.get('fieldId');
          var details;
          // i++;
          if(status == "confirmed" || status == "pending" || status == "declined"){
            this.hiddenRequestAll = false;
            if(status == "confirmed"){ this.confirmedRequests++; }
            else if(status == "pending"){ this.pendingRequests++; }
            else if(status == "declined"){ this.declinedRequests++; }
            this.requestsAll = this.confirmedRequests + this.pendingRequests + this.declinedRequests;
            // console.log("this is the requests : " + this.requestsAll);
            // this.TotalRequests = this.TotalRequests + this.requestsAll;
            this.confirmedRequestsPrecentage = (this.requestsAll == 0 ? "0" : ((this.confirmedRequests/this.requestsAll)*100).toFixed(1));
            this.declinedRequestsPrecentage = (this.requestsAll == 0 ? "0" : ((this.declinedRequests/this.requestsAll)*100).toFixed(1));
            this.pendingRequestsPrecentage = (this.requestsAll == 0 ? "0" : ((this.pendingRequests/this.requestsAll)*100).toFixed(1));
            this.labelsForChartTwo = [this.completedRequests, this.processingRequests];
          }
          // console.log(i);
          // if(i == data.length){
          //   console.log(this.testingFields)
          //   this.dataSource = new MatTableDataSource(this.testingFields);
          //   this.dataSource.paginator = this.paginator;
          //   this.dataSource.sort = this.sort;
          // }
          // i++;
        })
        var myChart = new Chart("myCanvas", {
          type: 'doughnut',
          data: {
              labels: ['Confirmed', 'Declined', 'Pending'],
              datasets: [{
                  label: '# of Votes',
                  data: [this.confirmedRequests, this.declinedRequests, this.pendingRequests],
                  backgroundColor: [
                      'rgba(46, 125, 50, 0.8)',
                      'rgba(230, 81, 0, 0.8)',
                      'rgba(199, 151, 52, 0.8)'
                  ],
                  borderColor: [
                      'rgba(46, 125, 50, 1)',
                      'rgba(230, 81, 0, 1)',
                      'rgba(199, 151, 52, 1)'
                  ],
                  borderWidth: 1,
              }]
          },
          options: {
              legend: {
                  labels: {
                    // fontColor : "white",
                  }
              }
            }
          });
        }
      }
    )
    this.loading = false;
  }

  getVisitDetailsWithFieldsNew(){
    var fieldVisits;
    this.fieldVisitService.getFieldVisitsByDivision(this.user)
    .subscribe(data => {
      fieldVisits = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldVisitTemp;
      })

      fieldVisits.forEach(f => {
        // if (f.status == 'request pending') requestPending += 1;
        // else if (f.status == 'visit pending') visitPending += 1;
        // else if (f.status == 'processing') processing += 1;
        // else if (f.status == 'completed') completed += 1;
        // console.log("in here");
        if(f.status == "pending" || f.status == "confirmed" || f.status == "declined"){
          if(f.status == "pending"){ this.pendingRequests++; }
          else if(f.status == "confirmed"){ this.confirmedRequests++; }
          else{ this.declinedRequests++ ;}
          this.requestsAll = this.pendingRequests + this.declinedRequests + this.confirmedRequests;
          this.TotalRequests = this.TotalRequests + this.requestsAll;
          this.confirmedRequestsPrecentage = (this.TotalRequests == 0 ? "0" : ((this.confirmedRequests/this.requestsAll)*100).toFixed(1));
          this.declinedRequestsPrecentage = (this.TotalRequests == 0 ? "0" : ((this.declinedRequests/this.requestsAll)*100).toFixed(1));
          this.pendingRequestsPrecentage = (this.TotalRequests == 0 ? "0" : ((this.pendingRequests/this.requestsAll)*100).toFixed(1));
        }
      })
      var myChart = new Chart("myCanvas", {
        type: 'doughnut',
        data: {
            labels: ['Confirmed', 'Declined', 'Pending'],
            datasets: [{
                label: '# of Votes',
                data: [this.confirmedRequests, this.declinedRequests, this.pendingRequests],
                backgroundColor: [
                    'rgba(46, 125, 50, 0.8)',
                    'rgba(230, 81, 0, 0.8)',
                    'rgba(199, 151, 52, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 125, 50, 1)',
                    'rgba(230, 81, 0, 1)',
                    'rgba(199, 151, 52, 1)'
                ],
                borderWidth: 1,
            }]
        },
        options: {
            legend: {
                labels: {
                  // fontColor : "white",
                }
            }
        }
      });
    });
  }

  getVisitDetailsWithFieldsTesting(){
    var fieldVisits;
    var relevantFields = [];
    var field;
    var farmer;
    this.completedRequests = 0;
    this.processingRequests = 0;
    console.log(this.user.division);
    var printable = false;
    
    this.fireStore.collection('FieldRequests', ref => ref.where('division', '==', this.user.division)).snapshotChanges().subscribe(
      data => {
          if(printable == false){
            printable = true;
            console.log(data.length);
            var i = 0;
            var fieldVisits = data.map(e => {
            // console.log(e.payload.doc.get('status'));
            var status = e.payload.doc.get('status');
            var fieldId = e.payload.doc.get('fieldId');
            var details;
            // i++;
            if(status == "completed" || status == "processing"){
              this.hiddenVisitAll = false;
              if(status == "completed"){ this.completedRequests++; }
              else if(status == "processing"){ this.processingRequests++; }
              this.visitsAll = this.completedRequests + this.processingRequests;
              // console.log("this is the visits : " + this.requestsAll);
              // this.TotalRequests = this.TotalRequests + this.visitsAll;
              this.completedRequestsPrecentage = (this.visitsAll == 0 ? "0" : ((this.completedRequests/this.visitsAll)*100).toFixed(1));
              this.processingRequestsPrecentage = (this.visitsAll == 0 ? "0" : ((this.processingRequests/this.visitsAll)*100).toFixed(1));
              this.labelsForChartTwo = [this.completedRequests, this.processingRequests];
            }else{
            }
            // console.log(i);
            // if(i == data.length){
            //   console.log(this.testingFields)
            //   this.dataSource = new MatTableDataSource(this.testingFields);
            //   this.dataSource.paginator = this.paginator;
            //   this.dataSource.sort = this.sort;
            // }
            // i++;
          })
          var myChart2 = new Chart("myCanvas2", {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Processing'],
                datasets: [{
                    label: '# of Votes',
                    data: [this.completedRequests, this.processingRequests],
                    backgroundColor: [
                        'rgba(46, 125, 50, 0.8)',
                        'rgba(230, 81, 0, 0.8)',
                    ],
                    borderColor: [
                        'rgba(46, 125, 50, 1)',
                        'rgba(230, 81, 0, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
              legend: {
                labels: {
                  // fontColor : "white",
                }
              }
            }
          });
        }
      }
    )
  }

  getVisitDetailsWithFields(){
    this.processingRequests = 0;
    this.fieldVisitService.getFieldVisitsByDivision(this.user).subscribe(data => {
      // console.log("fieldvisit details in user field : " + fieldVisits);
      this.fieldVisits = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldVisitTemp;
      })

      this.fieldVisits.forEach(f => {
        if(f.status == "processing" || f.status == "completed"){
          if(f.status == "processing"){ this.processingRequests++; }
          else{ this.completedRequests++ ;}
          this.visitsAll = this.completedRequests + this.processingRequests;
          this.TotalRequests = this.TotalRequests + this.visitsAll;
          this.completedRequestsPrecentage = (this.TotalRequests == 0 ? "0" : ((this.completedRequests/this.visitsAll)*100).toFixed(1));
          this.processingRequestsPrecentage = (this.TotalRequests == 0 ? "0" : ((this.processingRequests/this.visitsAll)*100).toFixed(1));
          this.labelsForChartTwo = [this.completedRequests, this.processingRequests];
        }
      })
        var myChart2 = new Chart("myCanvas2", {
          type: 'doughnut',
          data: {
              labels: ['Completed', 'Processing'],
              datasets: [{
                  label: '# of Votes',
                  data: [this.completedRequests, this.processingRequests],
                  backgroundColor: [
                      'rgba(46, 125, 50, 0.8)',
                      'rgba(230, 81, 0, 0.8)',
                  ],
                  borderColor: [
                      'rgba(46, 125, 50, 1)',
                      'rgba(230, 81, 0, 1)',
                  ],
                  borderWidth: 1,
              }]
          },
          options: {
            legend: {
              labels: {
                // fontColor : "white",
              }
            }
          }
      });
    });
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

  getCalculations(){
    console.log(this.TotalRequests);
    if(this.TotalRequests != 0){
      this.completedRequestsPrecentage = ((this.completedRequests/this.TotalRequests)*100).toFixed(2);
      this.processingRequestsPrecentage = ((this.processingRequests/this.TotalRequests)*100).toFixed(2);
      this.confirmedRequestsPrecentage = ((this.confirmedRequests/this.TotalRequests)*100).toFixed(2);
      this.declinedRequestsPrecentage = ((this.declinedRequests/this.TotalRequests)*100).toFixed(2);
      this.pendingRequestsPrecentage = ((this.pendingRequests/this.TotalRequests)*100).toFixed(2);
    }
  }

  ngOnDestroy() {
    console.log("end");
    
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
        this.farmersAll = data.length;
        // console.log(field);
        // console.log(this.testingFields)
        // this.dataSource = new MatTableDataSource(this.testingFields);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        
      }
    )
  }

  getFieldsDetailsWithFarmerTesting(){
    var credentials : UserCredential = {
      userID : '',
      email : '',
      password : ''
    }
    // this.all = 1;
    this.fireStore.collection('FieldDetails', ref => ref.where('division', '==', this.user.division)).snapshotChanges().subscribe(
      data => {
        this.fieldsAll = data.length;
      }
    )
  }
}
