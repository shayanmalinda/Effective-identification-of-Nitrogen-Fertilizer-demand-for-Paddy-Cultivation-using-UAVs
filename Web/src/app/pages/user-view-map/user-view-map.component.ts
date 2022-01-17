import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FieldData, FieldDataTemp } from 'app/models/field-data.model';
import { FieldDataService } from 'app/services/field-data.service';


@Component({
  selector: 'app-user-view-map',
  templateUrl: './user-view-map.component.html',
  styleUrls: ['./user-view-map.component.css']
})
export class UserViewMapComponent implements OnInit {

  fieldData : FieldData = {
    latitude : 0,
    longitude : 0,
    level : 0,
    officerId : "",
    requestId : "",
    timestamp : 0
  };
  valueArray = [];
  markersAdded = false;
  lat = 6.9271;
  lon = 79.8612;
  zoom = 400;
  maptype = "hybrid";
  // iconUrlYellow = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
  iconUrlYellow = "./assets/img/levels/levelThree.png";
  // iconUrlRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  iconUrlRed = "./assets/img/levels/levelTwo.png";
  // iconUrlOrange = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
  // iconUrlGreen = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  iconUrlGreen = "./assets/img/levels/levelFour.png";
  iconUrlBlue = "./assets/img/levels/levelFive.png";
  length = 0;
  loading = false;

  constructor(private router : Router, private fieldDataService : FieldDataService) { 
    this.fieldData.requestId = this.router.getCurrentNavigation().extras.state.fieldRequestId;
    console.log("this is the field id : " + this.fieldData.requestId);
    this.loadFieldData();
  }

  ngOnInit(): void {
  }

  loadFieldData(){
    var locations;
    var i = 0;
    this.fieldDataService.getFieldDataUsingRequestId(this.fieldData).subscribe(
      data => {
        this.length = data.length;
        locations = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as FieldDataTemp;
        })
        locations.forEach(element => {
          if(i == 0){
            this.lat = element.latitude;
            this.lon = element.longitude;
          }
          i++;
          this.valueArray.push({
            level : element.level,
            lat : element.latitude,
            lon : element.longitude,
            iconUrl : (element.level == 2 ? this.iconUrlRed : (element.level == 3 ? this.iconUrlYellow : (element.level == 4 ? this.iconUrlGreen : this.iconUrlBlue))),
          })
        });
        this.loading = false;
      }
    )
    console.log(this.valueArray);
    this.markersAdded = true;
  }

}
