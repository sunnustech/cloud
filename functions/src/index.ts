import * as development from './development'
// import { initializeApp } from 'firebase-admin/app'
import { authTest, handleMatch } from './production'
import { fs } from './init'

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

console.log(fs)
// initializeApp()

export { development, authTest, handleMatch }
