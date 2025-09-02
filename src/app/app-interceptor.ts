import { HttpContextToken, HttpErrorResponse, HttpInterceptor, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { Auth } from "./shared/services/auth";
import { EMPTY, map } from "rxjs";

/**
 * Context token opcional para saltarse el unwrap de respuestas { data, success, errorMessage }
 * Úsalo así:
 *   this.http.get<ApiResponse<any>>('/api/test', {
 *     context: new HttpContext().set(BYPASS_UNWRAP, true)
 *   });
 */
export const BYPASS_UNWRAP = new HttpContextToken<boolean>(() => false);

/**
 * Interceptor base, ahora mismo no hace nada.
 * Se puede usar como hook para logging/debug.
 */
export const appInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req);
};

/**
 * Valida si el token ha expirado en cada request.
 * - Si el usuario está logueado y el token ya venció:
 *   → llama a logout(true) en Auth
 *   → corta la petición devolviendo EMPTY (no llega al backend)
 */
export const tokenExpiredInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(Auth);

    if (authService.getIsLoggedIn()) {
        const now = new Date();
        if (now > authService.getTokenExpiration()) {
            authService.logout(true);
            return EMPTY;
        }
    }
    return next(req);
};

/**
 * Adjunta el JWT en el header Authorization de cada request,
 * si existe en localStorage.
 * - Formato: "Authorization: Bearer <token>"
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    if (token) {
        return next(
            req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token),
            })
        );
    }
    return next(req);
};

/**
 * Desenvuelve automáticamente las respuestas con la forma estándar:
 *   { data: T, success: boolean, errorMessage: string }
 *
 * - Si success === true → reemplaza el body por data (tu servicio recibe T directo).
 * - Si success === false → lanza un HttpErrorResponse para que lo maneje handleHttpErrorInterceptor.
 * - Si el request usa BYPASS_UNWRAP → no hace nada, pasa la respuesta cruda.
 */
export const unwrapDataInterceptor: HttpInterceptorFn = (req, next) => {
    const bypass = req.context.get(BYPASS_UNWRAP);

    return next(req).pipe(
        map(event => {
            if (bypass || !(event instanceof HttpResponse)) return event;

            const body = event.body;
            if (!body || typeof body !== 'object') return event;
            if (!('success' in body) || !('data' in body)) return event;

            if (body.success === false) {
                throw new HttpErrorResponse({
                    status: event.status,
                    url: event.url ?? undefined,
                    error: body,
                    statusText: 'API Error'
                });
            }
            return event.clone({ body: body.data });
        })
    )
};

// TODO: activar este interceptor cuando tenga el notification service
/**
 * Maneja errores HTTP globalmente:
 * - Muestra un popup con angular2-notifications
 * - Extrae errorMessage del backend si existe, o usa un mensaje genérico
 * - Retorna EMPTY para cancelar la cadena (no propaga el error más abajo)
 */
// export const handleHttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
//     const notifications = inject(NotificationsService);
//     return next(req).pipe(
//         catchError((err: HttpErrorResponse) => {
//             const msg =
//                 err?.error?.errorMessage ??
//                 err?.message ??
//                 'Error de red o del servidor';
//             notifications.error('Error', msg);
//             return EMPTY;
//         })
//     );
// };

/**
 * Muestra un spinner (NgxSpinnerService) mientras se procesa la request.
 * - spinner.show() al iniciar la request
 * - spinner.hide() al finalizar (éxito o error)
 */
// export const loadingScreenInterceptor: HttpInterceptorFn = (req, next) => {
//   const spinner = inject(NgxSpinnerService);
//   spinner.show();
//   return next(req).pipe(finalize(() => spinner.hide()));
// };