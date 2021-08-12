import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as Leaflet from 'leaflet';
import { Subscription } from 'rxjs';
//import "leaflet/dist/images/marker-shadow.png";
//import "leaflet/dist/images/marker-icon-2x.png";

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  map: Leaflet.Map;
  marker: any;
  subscription: Subscription;
  coords: any = [];
  constructor(private activatedRoute: ActivatedRoute,private geolocation: Geolocation) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log(resp);
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     let watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      console.log('WATCH',data);
     });
     //this.createMap();
  }
  private createMap(): void {
    this.map = Leaflet.map('mapId').setView([18.00000, -70.0000], 15);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(this.map);
  }

  ionViewDidEnter(): void {
    this.createMap();
  }

  ionViewDidLeave(): void {
    this.map.remove();
  }

  btnUpdateLocation(tracking){
    if (tracking){
      this.subscription = this.geolocation.watchPosition().subscribe(async(response: any)=>{
        this.coords = [response.coords.latitude, response.coords.longitude];
        console.log(response);
        //this.api.updateDriverLocation(this.coords[0], this.coords[1], tracking)
       // .then(()=>{
          if (this.marker != null){
            this.map.removeLayer(this.marker);
          }
          this.marker = Leaflet.circleMarker(this.coords)
          .addTo(this.map).bindPopup("You are here.");
          this.map.setView(this.coords, 16);
          console.log('tracking',this.marker);
        //}).catch(()=>{
         // this.alert.presentCustomAlert("Problem", "Check your internet connection.");
       // });
      });
    }else{
      this.subscription.unsubscribe();
    //  this.api.updateDriverLocation(this.coords[0], this.coords[1], tracking)
    //  .then(()=>{
       // this.alert.presentCustomAlert("Success", "Location paused.");
    //  }).catch(()=>{
       // this.alert.presentCustomAlert("Problem", "Check your internet connection.");
    //  });
    }
  }
}
