import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BhHomePage } from './bh-home';

@NgModule({
  declarations: [
    BhHomePage,
  ],
  imports: [
    IonicPageModule.forChild(BhHomePage),
  ],
})
export class BhHomePageModule {}
