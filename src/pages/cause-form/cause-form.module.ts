import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CauseFormPage } from './cause-form';

@NgModule({
  declarations: [
    CauseFormPage,
  ],
  imports: [
    IonicPageModule.forChild(CauseFormPage),
  ],
})
export class CauseFormPageModule {}
