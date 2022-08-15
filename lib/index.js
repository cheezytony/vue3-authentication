"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
const vue_1 = require("vue");
const injectionKey = Symbol('[vue-3]: auth');
const useAuth = () => (0, vue_1.inject)(injectionKey);
exports.useAuth = useAuth;
exports.default = {
    install: (app, { middlewares, router, store }) => {
        const getUser = () => store.state.session.user;
        const getToken = () => store.state.session.token;
        const isLoggedIn = () => !!getUser();
        const getPermissions = () => store.state.session.permissions;
        const canDo = (permissionName) => {
            const permissions = getPermissions();
            if (typeof permissionName === 'string') {
                return permissions.indexOf(permissionName) > -1;
            }
            return permissionName.some((permission) => permissions.indexOf(permission) > -1);
        };
        const canAccess = (routeName, params) => {
            const routeNames = (typeof routeName === 'string') ? [routeName] : routeName;
            return routeNames.some((name) => {
                const route = router.resolve({ name, params });
                const { meta: { permissions } } = route;
                return !permissions ? true : permissions.indexOf('*') > -1 || canDo(permissions || []);
            });
        };
        const login = (token, user, permissions) => store.dispatch('session/login', { token, user, permissions });
        const logout = () => store.dispatch('session/logout');
        const auth = {
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
        const executeMiddleware = (middleware, params) => middleware(params, auth);
        const authorizeRoute = (to, from, next) => {
            const { meta: { middlewares: routeMiddlewares = [] } } = to;
            const defaultMiddlewares = router.options.middlewares || [];
            routeMiddlewares.unshift(...defaultMiddlewares);
            const allMiddlewares = routeMiddlewares.map((name) => auth.middlewares[name] || (() => true));
            const isRouteAuthorized = allMiddlewares.every((middleware) => executeMiddleware(middleware, { to, from, next }));
            if (isRouteAuthorized) {
                next();
            }
        };
        const init = () => {
            router.beforeEach((to, from, next) => {
                authorizeRoute(to, from, next);
            });
        };
        init();
    },
};
