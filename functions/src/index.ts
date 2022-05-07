import * as development from './development'
import { authTest, handleMatch } from './production'
import { app, fs } from './init'

/* [production.ts]
 *   - contains only onCall functions
 *   - callable by an app using Firebase SDK
 *   - use for production-ready functions
 *
 * [development.ts]
 *   - contains only onRequest functions
 *   - callable by simplying navigating to the url
 *   - use for writing new functions
 */

console.log(app.name, fs.settings.name)


export { development, authTest, handleMatch }
