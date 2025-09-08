import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { UserProfile } from './user-profile/user-profile';
import { ContentConfig } from './content-config/content-config';
import { adminGuard } from './shared/guards/admin.guard';
import { LibroDetalle } from './libro-detalle/libro-detalle';

export const routes: Routes = [
    {
        // Home and available books display
        path: '',
        component: Home
    },
    {
        path: 'libros/:id',
        component: LibroDetalle
    },
    {
        // Login card for both users and admins
        path: 'login',
        component: Login
    },
    {
        // User profile and checkout history
        path: 'profile',
        component: UserProfile
    },
    {
        // Protected admin console
        path: 'content-config',
        component: ContentConfig,
        canMatch: [adminGuard]
    },
    {
        // Redirect everything else to home
        path: '**',
        redirectTo: ''
    }
];
