import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VerifycodePage } from './verifycode';

@NgModule({
  declarations: [
    VerifycodePage,
  ],
  imports: [
    IonicPageModule.forChild(VerifycodePage),
  ],
})
export class VerifycodePageModule {}
