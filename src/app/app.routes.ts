import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoriesComponent } from './components/manage/categories/categories.component';
import { CategoryFormComponent } from './components/manage/category-form/category-form.component';
import { BrandFormComponent } from './components/manage/brand-form/brand-form.component';
import { BrandsComponent } from './components/manage/brands/brands.component';
import { ProductFormComponent } from './components/manage/product-form/product-form.component';
import { ProductsComponent } from './components/manage/products/products.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductsDetailComponent } from './components/products-detail/products-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGaurd } from './components/cores/auth-gaurd';
import { AdminDashboardComponent } from './components/manage/admin-dashboard/admin-dashboard.component';
import { adminGaurd } from './components/cores/admin-gaurd';
import { CustomerProfileComponent } from './components/customer-profile/customer-profile.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { OrdersComponent } from './components/manage/orders/orders.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate:[authGaurd]
    },
    {
        path:'admin/categories',
        component:CategoriesComponent,
        canActivate:[adminGaurd]

    }, 
    {
        path:'admin/categories/add',
        component:CategoryFormComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/categories/:id',
        component:CategoryFormComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/brands',
        component:BrandsComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/brands/add',
        component:BrandFormComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/brands/:id',
        component:BrandFormComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/products',
        component:ProductsComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/products/add',
        component:ProductFormComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'admin/products/:id',
        component:ProductFormComponent,
        canActivate:[adminGaurd]
    },
     {
        path:'admin/orders',
        component:OrdersComponent,
        canActivate:[adminGaurd]
    },
    {
        path:'product',
        component:ProductsListComponent,
        canActivate:[authGaurd]
    },
    {
        path:'product/:id',
        component:ProductsDetailComponent,
        canActivate:[authGaurd]
    },
    {
        path:'customer-profile',
        component:CustomerProfileComponent,
        canActivate:[authGaurd]
    },
    {
        path:'order',
        component:CustomerOrdersComponent,
        canActivate:[authGaurd]
    },
    {
        path:'wishlist',
        component:WishlistComponent,
        canActivate:[authGaurd]
    },
    {
        path:'shopping-cart',
        component:ShoppingCartComponent,
        canActivate:[authGaurd]
    },
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'admin',
        component:AdminDashboardComponent,
        canActivate:[adminGaurd]
    }
];
