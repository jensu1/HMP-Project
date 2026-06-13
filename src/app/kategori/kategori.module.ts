import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KategoriPageRoutingModule } from './kategori-routing.module';

import { KategoriPage } from './kategori.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, KategoriPageRoutingModule],
  declarations: [KategoriPage],
})
export class KategoriPageModule {}
