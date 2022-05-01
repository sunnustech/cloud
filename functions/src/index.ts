import * as development from './development'
import { authTest, handleMatch } from './production'
import { app } from './firebase'

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

console.debug(app)

export { development, authTest, handleMatch }
