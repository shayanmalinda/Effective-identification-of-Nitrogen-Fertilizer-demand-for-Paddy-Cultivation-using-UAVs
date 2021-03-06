import { Component, OnInit } from '@angular/core';
import * as EXIF from 'exif-js';
import { HttpClient } from '@angular/common/http';
import {MatCardHarness} from '@angular/material/card/testing';
import { FieldDataService } from 'app/services/field-data.service';
import { FieldData } from 'app/models/field-data.model';
import { Message } from 'app/models/message.model';
import { DialogService } from 'app/services/dialog.service';
import { Router } from '@angular/router';

// declare var EXIF: any;

@Component({
  selector: 'app-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.css']
})



export class MetaDataComponent implements OnInit {

  lat = 6.9271;
  lon = 79.8612;
  zoom = 400
  maptype = "hybrid"
  loading : boolean = false;
  // maptype = "satellite"
  // iconUrlYellow = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
  iconUrlYellow = "./assets/img/levels/levelThree.png";
  // iconUrlRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  iconUrlRed = "./assets/img/levels/levelTwo.png";
  // iconUrlOrange = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
  // iconUrlGreen = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  iconUrlGreen = "./assets/img/levels/levelFour.png";
  iconUrlBlue = "./assets/img/levels/levelFive.png";
  imageLocations = [];
  length = 0;
  valueArray = [];
  public res: { [key: string]: any };
  markersAdded = false;
  disability = false;
  fieldData : FieldData = {
    latitude : 0,
    longitude : 0,
    level : 0,
    officerId : "",
    requestId : "",
    timestamp : 0
  };
  message : Message = {
    title : '',
    showMessage : ''
  }
  uploadedImages = 0;
  previousImages = 0;
  havePreviousImages : boolean = false;

  constructor(private http : HttpClient, private fieldDataService : FieldDataService, private dialog : DialogService, private router : Router) { 
    this.fieldData.requestId = this.router.getCurrentNavigation().extras.state.fieldRequestId;
    console.log("this is the field id : " + this.fieldData.requestId);
    this.loadFieldData();
  }

  ngOnInit(): void {}

  public onChange(event) {
    // console.log("this is triggered : " + event.target.files.length);
    this.length = event.target.files.length;
    for(var i = 0; i < event.target.files.length ; i++){
      // console.log("hello");
      // this.imageLocations.push
      const input: HTMLInputElement = event.target as any;
      const file: Blob = input.files[i];
      // console.log(file)
      const fileReader = new FileReader();
      fileReader.addEventListener('load', fileReaderEvent => {
        const data = EXIF.readFromBinaryFile(fileReader.result);
        if (data) {
          this.res = data;
          // console.log(this.res);
          var latitude = (this.res.GPSLatitude[0]) + (this.res.GPSLatitude[1]/60) + (this.res.GPSLatitude[2]/3600);
          var longitude = (this.res.GPSLongitude[0]) + (this.res.GPSLongitude[1]/60) + (this.res.GPSLongitude[2]/3600);
          // console.log("this is the latitude of the image : " + latitude);
          // console.log("this is the longtitude of the image : " + longitude);
          this.lat = latitude;
          this.lon = longitude;
          this.imageLocations.push(
            {
              long : longitude,
              lati : latitude,
              level : '0',
            }
          )
          console.log(this.imageLocations);
        } else {
          this.res = null;
        }
      });
      fileReader.readAsArrayBuffer(file);
      // console.log(" this is the array of images : " + this.imageLocations);
    }
    console.log("this is the array of images : " + this.imageLocations);
    
    
  }

  async changeTriggers(event){
    this.loading = true;
    const currentTime = new Date;
    console.log("length" + event.target.files.length);
    this.length = event.target.files.length;
     for(var i = 0 ; i < event.target.files.length; i++){
      await new Promise<void>(resolve => {
        setTimeout(()=> {
          const selectedFile = <File>event.target.files[i];
          const fileReader = new FileReader();
          var latitude = 0;
          var longitude = 0;
          fileReader.addEventListener('load', fileReaderEvent => {
            const data = EXIF.readFromBinaryFile(fileReader.result);
            if (data) {
              this.res = data;
              // console.log(this.res);
              latitude = (this.res.GPSLatitude[0]) + (this.res.GPSLatitude[1]/60) + (this.res.GPSLatitude[2]/3600);
              longitude = (this.res.GPSLongitude[0]) + (this.res.GPSLongitude[1]/60) + (this.res.GPSLongitude[2]/3600);
              // console.log("this is the latitude of the image : " + latitude);
              // console.log("this is the longtitude of the image : " + longitude);
              // this.lat = latitude;
              // this.lon = longitude;
              // this.imageLocations.push(
              //   {
              //     long : longitude,
              //     lati : latitude,
              //     level : '0',
              //   }
              // )
              // console.log(this.imageLocations);
            } else {
              this.res = null;
            }
          });
          fileReader.readAsArrayBuffer(selectedFile);
          const fd = new FormData();
          fd.append('image', selectedFile)
          this.fieldDataService.getLevelFromServer(fd).subscribe(
            res => {
              console.log(res);
              if(i == 0){
                this.lat = latitude;
                this.lon = longitude;
              }
              this.valueArray.push({
                file : selectedFile,
                level : res,
                lat : latitude,
                lon : longitude,
                iconUrl : (res == 2 ? this.iconUrlRed : (res == 3 ? this.iconUrlYellow : (res == 4 ? this.iconUrlGreen : this.iconUrlBlue))),
              });
              //should check for the existing records 
              this.fieldData.level = res;
              this.fieldData.latitude = latitude;
              this.fieldData.longitude = longitude;
              this.fieldData.officerId = sessionStorage.getItem('userID');
              this.fieldData.timestamp = currentTime.getTime();
              // console.log(this.fieldData);
              this.fieldDataService.getFieldData(this.fieldData)
              .subscribe(
                data => {
                  if(data.length == 0){
                    this.fieldDataService.insertFieldData(this.fieldData)
                    .then(res => {
                      // console.log(res);
                      // this.uploadedImages ++;
                      // this.message.title = "success";
                      // this.message.showMessage = "You have successfully uploaded images of the field request !";
                      // this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
                      //   // this.updateSessionDetails();
                      //   // if (this.user.userRole != "admin")
                      //   //   this.router.navigate(['/profile']);
                      // });

                    }, err => {
                      this.loading = false;
                      this.message.title = "error";
                      this.message.showMessage = err;
                      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
                        // this.clearFields();
                      })
                    });
                  }else{
                    // this.uploadedImages ++;
                  }
                }
              )
              resolve();
            }
          )
        }, 2000);
      });
     }
     console.log(this.valueArray);
     this.loading = false;
     this.message.title = "success";
     this.message.showMessage = "You have uploaded images successfully !!";
     this.dialog.openConfirmDialog(this.message);
     //success msg 
    //  console.log(this.length)
    //  console.log(this.uploadedImages)
    //  if(this.length != this.uploadedImages){
    //     this.message.title = "success";
    //     this.message.showMessage = "You have uploaded images successfully !!";
    //     this.dialog.openConfirmDialog(this.message);
    //  }
    //  this.valueArray.length = 0;
     this.markersAdded = true;
     this.disability = true;
     this.uploadedImages = 0;
  }

  loadFieldData(){
    console.log(this.fieldData.requestId);
    this.fieldDataService.getFieldDataUsingRequestId(this.fieldData).subscribe(
      data => {
        if(data.length > 0){
          this.previousImages = data.length;
          this.havePreviousImages = true;
        }
      }
    )
  }
}
