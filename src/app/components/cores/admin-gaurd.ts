import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

export const adminGaurd: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is logged in
    if (authService.isLoggedIn) {
        // Check if user is an admin
        if (authService.isAdmin) {
            // Allow access to the admin component
            return true;
        } else {
            // Redirect non-admins to the homepage or another restricted page
            console.log('Access denied: User is not an admin');
            router.navigateByUrl('/');
            return false;
        }
    }
    // If not logged in, redirect to login page
    console.log('Access denied: User is not logged in');
    router.navigateByUrl('/login');
    return false;
}
