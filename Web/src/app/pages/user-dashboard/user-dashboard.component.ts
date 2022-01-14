import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  // public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // public doughnutChartData: MultiDataSet = [
  //   [250, 130, 70],
  // ];
  // public doughnutChartType: ChartType = 'doughnut';


  constructor(private router : Router) { }

  ngOnInit(): void {

    var myChart = new Chart("myCanvas", {
      type: 'doughnut',
      data: {
          labels: ['Completed', 'Declined', 'Pending'],
          datasets: [{
              label: '# of Votes',
              data: [100, 19, 3],
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
                fontColor : "white",
              }
          }
      }
  });

  var myChart2 = new Chart("myCanvas2", {
    type: 'doughnut',
    data: {
        labels: ['Completed', 'Processing'],
        datasets: [{
            label: '# of Votes',
            data: [100, 19],
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
          fontColor : "white",
        }
      }
    }
});

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

}
