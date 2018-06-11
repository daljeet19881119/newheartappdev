import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MerchantFormPage } from './merchant-form';

@NgModule({
  declarations: [
    MerchantFormPage,
  ],
  imports: [
    IonicPageModule.forChild(MerchantFormPage),
  ],
})
export class MerchantFormPageModule {}
