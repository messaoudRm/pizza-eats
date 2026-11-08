import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { BrandMenu } from './pages/brand-menu/brand-menu';
import { Cart } from './pages/cart/cart';
import { Payment } from './pages/payment/payment';
import { Confirmation } from './pages/confirmation/confirmation';
import { OrderHistory } from './pages/order-history/order-history';
import { OrderTracking } from './pages/order-tracking/order-tracking';
import { Settings } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Connexion · Pizza Eats' },
  { path: 'home', component: Home, canActivate: [authGuard], title: 'Enseignes · Pizza Eats' },
  { path: 'brands/:brandId', component: BrandMenu, canActivate: [authGuard], title: 'Menu · Pizza Eats' },
  { path: 'cart', component: Cart, canActivate: [authGuard], title: 'Panier · Pizza Eats' },
  { path: 'payment', component: Payment, canActivate: [authGuard], title: 'Paiement · Pizza Eats' },
  { path: 'confirmation', component: Confirmation, canActivate: [authGuard], title: 'Confirmation · Pizza Eats' },
  { path: 'orders', component: OrderHistory, canActivate: [authGuard], title: 'Mes commandes · Pizza Eats' },
  { path: 'orders/:orderId', component: OrderTracking, canActivate: [authGuard], title: 'Suivi · Pizza Eats' },
  { path: 'settings', component: Settings, canActivate: [authGuard], title: 'Paramètres · Pizza Eats' },
  { path: '**', redirectTo: 'home' },
];
