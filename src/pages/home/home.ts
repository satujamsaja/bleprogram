import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { BLE } from 'ionic-native';
import { BledetailPage } from '../../pages/bledetail/bledetail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  bles;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
  }

  // Scan nearby device.
  scanBle() {
    this.bles = [];
    let loading = this.loadingCtrl.create({
      content: "Scanning..."
    });

    loading.present();
    BLE.startScan([]).subscribe(ble => {
      if (ble) {
        this.bles.push(ble);
        loading.dismiss();
        BLE.stopScan();
      }
    });
  }

  // Connect to selected bluetooth.
  connectBle(ble) {
    this.navCtrl.push(BledetailPage, { ble: ble });
  }

}
