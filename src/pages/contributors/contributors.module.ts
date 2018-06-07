import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContributorsPage } from './contributors';

@NgModule({
  declarations: [
    ContributorsPage,
  ],
  imports: [
    IonicPageModule.forChild(ContributorsPage),
  ],
})
export class ContributorsPageModule {}
