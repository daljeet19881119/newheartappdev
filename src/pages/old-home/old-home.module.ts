import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OldHomePage } from './old-home';

@NgModule({
  declarations: [
    OldHomePage,
  ],
  imports: [
    IonicPageModule.forChild(OldHomePage),
  ],
})
export class OldHomePageModule {}
