import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from 'ionic-native';

@Component({
  selector: 'page-bledetail',
  templateUrl: 'bledetail.html'
})
export class BledetailPage {

  ble;
  blerxData: string;
  connectionStatus: string = 'Not connected';
  speed = 255;
  oav = false;
  wf = false;
  lf = false;
  vAngle = 0;
  hAngle = 0;

  hm10 = {
    serviceUUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
    txCharacteristic: '0000ffe1-0000-1000-8000-00805f9b34fb',
    rxCharacteristic: '0000ffe1-0000-1000-8000-00805f9b34fb'
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone) {
    this.ble = this.navParams.get('ble');
  }

  ionViewDidLoad() {
    BLE.connect(this.ble.id).subscribe(bleinfo => {
      this.connectionStatus = 'Connected';
      this.zone.run(() => {
        BLE.startNotification(this.ble.id, this.hm10.serviceUUID, this.hm10.rxCharacteristic).subscribe(notificationData => {
          this.blerxData = this.bytesToString(notificationData);
        });
      });
    });
  }

  // Disconnect from selected bluetooth.
  disconnect() {
    BLE.disconnect(this.ble.id);
    this.navCtrl.pop();
  }

  // Convert array buffer to string.
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  // Convert string to array buffer.
  stringToBytes(string) {
    let array = new Uint8Array(string.length);
    for (let i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  // Move car on selected button.
  moveCar(direction) {
    if (this.ble) {
      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes(direction));
    }
  }

  // Set motor speed.
  setSpeed() {
    if (this.ble) {
      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes('SPEED-' + this.speed));
    }
  }

  // Set Obstacle avoidance option.
  enableOav() {
    if (this.ble) {
      let oavText = 'OAV-DISABLE';
      if (this.oav) {
        oavText = 'OAV-ENABLE';
      }

      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes(oavText));
    }
  }

  // Set wf option.
  enableWf() {
    if (this.ble) {
      let wfText = 'WF-DISABLE';
      if (this.wf) {
        wfText = 'WF-ENABLE';
      }

      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes(wfText));
    }
  }

  // Set lf option.
  enableLf() {
    if (this.ble) {
      let lfText = 'LF-DISABLE';
      if (this.lf) {
        lfText = 'LF-ENABLE';
      }

      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes(lfText));
    }
  }

  // Rotate vertical servo.
  rotateVServo() {
    if (this.ble) {
      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes('VSERVO-' + this.vAngle));
    }
  }

  // Rotate vertical servo.
  rotateHServo() {
    if (this.ble) {
      BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes('HSERVO-' + this.hAngle));
    }
  }

}
