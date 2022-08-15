import { App } from 'vue';
import type { AuthenticationProvider, Middleware, MiddlewareCollection, MiddlewareNavigationParams, PluginConfig } from './types';
export { AuthenticationProvider, Middleware, MiddlewareCollection, MiddlewareNavigationParams, PluginConfig, };
export declare const useAuth: () => AuthenticationProvider;
declare const _default: {
    install: (app: App, { middlewares, router, store }: PluginConfig) => void;
};
export default _default;
