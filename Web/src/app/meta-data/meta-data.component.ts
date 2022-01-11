import { Component, OnInit } from '@angular/core';
import * as EXIF from 'exif-js';

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
  iconUrl = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  imageLocations = [];
  length = 0;
  public res: { [key: string]: any };

  constructor() { }

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

}
