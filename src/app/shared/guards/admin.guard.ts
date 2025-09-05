import { inject } from "@angular/core";
import { Auth } from "../services/auth";
import { CanMatchFn, Router, UrlSegment } from "@angular/router";

export const adminGuard: CanMatchFn = (route, segments: UrlSegment[]) => {
    const auth = inject(Auth);
    const router = inject(Router);

    // Hydrate claims
    auth.decodeToken();

    // Build real URL
    const returnUrl = '/' + segments.map(s => s.path).join('/');

    // If token missing or expired => go to login
    if (!auth.getIsLoggedIn()) {
        router.navigate(['/login'], {queryParams: { returnUrl } });
        return false;
    }

    // Admin role in the URI
    const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
    const isAdmin = auth.hasRole('Administrator', ROLE_CLAIM);

    if (isAdmin) return true;

    router.navigateByUrl('/');
    return false;
};