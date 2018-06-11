import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VolunteerFormPage } from './volunteer-form';

@NgModule({
  declarations: [
    VolunteerFormPage,
  ],
  imports: [
    IonicPageModule.forChild(VolunteerFormPage),
  ],
})
export class VolunteerFormPageModule {}
