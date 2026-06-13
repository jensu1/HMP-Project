import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewsCategoryPageRoutingModule } from './news-category-routing.module';

import { NewsCategoryPage } from './news-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewsCategoryPageRoutingModule,
  ],
  declarations: [NewsCategoryPage],
})
export class NewsCategoryPageModule {}
