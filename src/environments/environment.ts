// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  SERVER_URL:                     'http://localhost:3000',
  SERVER_URL_IO:                  'http://localhost:3000',
  SERVER_URL_REG:                 'http://localhost:3000/auth/register',
  SERVER_URL_LOGIN:               'http://localhost:3000/auth/login',
  SERVER_URL_LOGOUT:              'http://localhost:3000/auth/logout',
  // SERVER_URL_TOKEN_REFRESH:       'http://localhost:3000/auth/refreshToken',
  // SERVER_URL_TOKEN_CHECK_ACCESS:  'http://localhost:3000/auth/checkToken',
  SERVER_URL_CHECK_SESSION:       'http://localhost:3000/auth/checkSession',
  SERVER_URL_MESSAGES_GET:        'http://localhost:3000/api/messages/get'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
