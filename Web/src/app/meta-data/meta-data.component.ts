import { Component, OnInit } from '@angular/core';
import * as EXIF from 'exif-js';
import { HttpClient } from '@angular/common/http';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

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
  // maptype = "satellite"
  // iconUrlYellow = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
  iconUrlYellow = "./assets/img/levels/levelThree.png";
  // iconUrlRed = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  iconUrlRed = "./assets/img/levels/levelTwo.png";
  // iconUrlOrange = "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
  // iconUrlGreen = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  iconUrlGreen = "./assets/img/levels/levelFour.png";
  imageLocations = [];
  length = 0;
  valueArray = [];
  public res: { [key: string]: any };
  markersAdded = false;

  constructor(private http : HttpClient) { }

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
          this.http.post('http://192.168.1.100:5000/process', fd).subscribe(
            res => {
              if(i == 0){
                this.lat = latitude;
                this.lon = longitude;
              }
              this.valueArray.push({
                file : selectedFile,
                level : res,
                lat : latitude,
                lon : longitude,
                iconUrl : (res == 2 ? this.iconUrlRed : (res == 3 ? this.iconUrlYellow : this.iconUrlGreen))
              });
              resolve();
            }
          )
        }, 2000);
      });
     }
     console.log(this.valueArray);
     this.markersAdded = true;
  }
}
