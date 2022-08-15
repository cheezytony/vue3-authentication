import { NavigationGuardNext, RouteLocationNormalized, RouteParams, Router } from 'vue-router';
import { Store } from 'vuex';
export interface AuthenticationProvider {
    store: Store<any>;
    getUser: () => any | null;
    getToken: () => string | null;
    isLoggedIn: () => boolean;
    getPermissions: () => string[];
    canDo: (permissionName: string | string[]) => boolean;
    canAccess: (routeName: string | string[], params?: RouteParams) => boolean;
    login: (token: string, user?: any, permissions?: string[]) => Promise<any>;
    logout: () => Promise<any>;
    middlewares: MiddlewareCollection;
}
export interface MiddlewareNavigationParams {
    to: RouteLocationNormalized;
    from: RouteLocationNormalized;
    next: NavigationGuardNext;
}
export declare type Middleware = (params: MiddlewareNavigationParams, context: AuthenticationProvider) => boolean;
export interface MiddlewareCollection {
    [name: string]: Middleware;
}
export interface PluginConfig {
    middlewares: MiddlewareCollection;
    router: Router;
    store: Store<any>;
}
