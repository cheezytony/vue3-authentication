/* eslint-disable no-use-before-define */
import {
  NavigationGuardNext, RouteLocationNormalized, RouteParams, Router,
} from 'vue-router';
import { Store } from 'vuex';

export interface AuthenticationProvider {
  store: Store<any>
  getUser: () => any | null
  getToken: () => string | null
  isLoggedIn: () => boolean
  getPermissions: () => string[]
  // eslint-disable-next-line no-unused-vars
  canDo: (permissionName: string | string[]) => boolean
  // eslint-disable-next-line no-unused-vars
  canAccess: (routeName: string | string[], params?: RouteParams) => boolean
  // eslint-disable-next-line no-unused-vars
  login: (token: string, user?: any, permissions?: string[]) => Promise<any>
  logout: () => Promise<any>
  middlewares: MiddlewareCollection
}

export interface MiddlewareNavigationParams {
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  next: NavigationGuardNext
}

export type Middleware = (
  // eslint-disable-next-line no-unused-vars
  params: MiddlewareNavigationParams,
  // eslint-disable-next-line no-unused-vars
  context: AuthenticationProvider
) => boolean;

export interface MiddlewareCollection {
  [name: string]: Middleware
}

export interface PluginConfig {
  middlewares: MiddlewareCollection
  router: Router
  store: Store<any>
}
