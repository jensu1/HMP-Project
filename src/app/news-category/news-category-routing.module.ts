import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsCategoryPage } from './news-category.page';

const routes: Routes = [
  {
    path: '',
    component: NewsCategoryPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsCategoryPageRoutingModule {}
