import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { UserProfile } from './user-profile/user-profile';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'profile',
        component: UserProfile
    }
];
