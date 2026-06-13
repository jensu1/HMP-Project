import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'kategori',
    loadChildren: () =>
      import('./kategori/kategori.module').then((m) => m.KategoriPageModule),
  },
  {
    path: 'favorite',
    loadChildren: () =>
      import('./favorite/favorite.module').then((m) => m.FavoritePageModule),
  },
  {
    path: 'news-detail',
    loadChildren: () =>
      import('./news-detail/news-detail.module').then(
        (m) => m.NewsDetailPageModule
      ),
  },
  {
    path: 'news-category',
    loadChildren: () =>
      import('./news-category/news-category.module').then(
        (m) => m.NewsCategoryPageModule
      ),
  },
  {
    path: 'add-category',
    loadChildren: () =>
      import('./add-category/add-category.module').then(
        (m) => m.AddCategoryPageModule
      ),
  },
  {
    path: 'add-news',
    loadChildren: () =>
      import('./add-news/add-news.module').then((m) => m.AddNewsPageModule),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
