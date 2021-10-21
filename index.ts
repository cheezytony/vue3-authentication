import { App, inject } from 'vue';
import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteParams,
} from 'vue-router';
import {
  AuthenticationProvider,
  Middleware,
  MiddlewareCollection,
  MiddlewareNavigationParams,
  PluginConfig,
} from './types';

export {
  AuthenticationProvider,
  Middleware,
  MiddlewareCollection,
  MiddlewareNavigationParams,
  PluginConfig,
};

const injectionKey = Symbol('[vue-3]: auth');

export const useAuth = () => inject(injectionKey) as AuthenticationProvider;

export default {
  install: (app: App, { middlewares, router, store }: PluginConfig) => {
    const getUser = () => store.state.session.user;

    const getToken = () => store.state.session.token;

    const isLoggedIn = () => !!getUser();

    const getPermissions = () => store.state.session.permissions as string[];

    const canDo = (permissionName: string | string[]) => {
      const permissions = getPermissions();
      if (typeof permissionName === 'string') {
        return permissions.indexOf(permissionName as string) > -1;
      }

      return (permissionName as string[]).some(
        (permission) => permissions.indexOf(permission) > -1,
      );
    };

    const canAccess = (routeName: string | string[], params?: RouteParams) => {
      const routeNames = (typeof routeName === 'string') ? [routeName] : routeName;

      return routeNames.some((name) => {
        const route = router.resolve({ name, params });
        const { meta: { permissions } } = route;

        return !permissions ? true : permissions.indexOf('*') > -1 || canDo(permissions || []);
      });
    };

    const login = (
      token: string,
      user?: any,
      permissions?: string[],
    ) => store.dispatch('session/login', { token, user, permissions });

    const logout = () => store.dispatch('session/logout');

    const auth: AuthenticationProvider = {
      store,

      getUser,
      getToken,
      isLoggedIn,

      getPermissions,
      canDo,
      canAccess,

      login,
      logout,

      middlewares,
    };

    app.provide(injectionKey, auth);
    // eslint-disable-next-line no-param-reassign
    app.config.globalProperties.$auth = auth;

    const executeMiddleware = (
      middleware: Middleware,
      params: MiddlewareNavigationParams,
    ): boolean => middleware(params, auth);

    const authorizeRoute = (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ): void => {
      const { meta: { middlewares: routeMiddlewares = [] } } = to;
      const defaultMiddlewares = router.options.middlewares || [];

      routeMiddlewares.unshift(...defaultMiddlewares);

      const allMiddlewares = routeMiddlewares.map((name) => auth.middlewares[name] || (() => true));

      const isRouteAuthorized = allMiddlewares.every(
        (middleware) => executeMiddleware(middleware, { to, from, next }),
      );

      if (isRouteAuthorized) {
        next();
      }
    };

    const init = () => {
      router.beforeEach((
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext,
      ) => {
        authorizeRoute(to, from, next);
      });
    };

    init();
  },
};
