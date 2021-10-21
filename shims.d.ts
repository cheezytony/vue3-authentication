import { AuthenticationProvider } from './types';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $auth: AuthenticationProvider
  }

}

declare module 'vue-router' {
  interface RouteMeta {
    middlewares: string[]
    permissions?: string[]
  }

  interface RouterOptions {
    middlewares?: string[]
  }
}
