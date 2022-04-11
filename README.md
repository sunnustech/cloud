## Getting Started

Clone the repo into a folder called `cloud`. After cloning the repo, install
node packages by running `yarn` in three directories:

- `cloud/`
- `cloud/functions`
- `cloud/functions/src/tests`

Then make sure you're logged in:
1. `cd cloud/functions`
2. `yarn firebase login`

(Note that you probably need admin/developer access to the firebase project)

## Using this

`cloud/functions` contain deployed cloud functions.  
`cloud/functions/src/tests` container local debugging tests.

There are two important types of cloud functions:
1. `onRequest`: this is open to public. All it takes to invoke such a function
   is to open a particular url.
2. `onCall`: this is only callable by a fellow Firebase SDK app. Easier to call
   from the app frontend and has better security.

I generally write an `onRequest` function first for easy testing, then convert
it to an `onCall` function later on.

## Writing your first function

Here's an example workflow of how I write a `helloWorld` cloud function.
1. [Setting up server-side](#setting-up-server-side)
2. [Setting up client tester](#setting-up-client-tester)

### Setting up server-side

1. Export a new `onRequest` function `helloWorld` in
   `cloud/function/src/index.ts`

```js
// cloud/function/src/index.ts
export const helloWorld = https.onRequest(async (req, res) => {
  console.log('hello, server!')
  res.json({
    message: 'hello, requester!',
    serverReceived: req.body,
  })
})
```

2. Spin up a local emulator server

```
cd cloud/functions && yarn serve
```

3. Your terminal should should a list of local urls, one of which ending in
   `helloWorld`.

4. Go to that link in your browser. After loading, both your terminal and your
   browser should have some nice ouptut.

### Setting up client tester

To avoid needing to navigate to the link each time, you can use a simple
node.js request sender.

1. create a new `.ts` file in `cloud/functions/src/tests/src` (reference `index.ts`)
2. create a script in `package.json` to build and run it.
3. profit

Note: Edit in the `src` folder. The `lib` folder contains build output files
only.

### Testing

The current `index.ts` contains a request sender for `helloWorld`. To see it in
action, start the emulator in one terminal with

```
cd cloud/functions && yarn serve
```

and in another terminal build and run the testing script with

```bash
cd cloud/tests && yarn tsc && node lib/index.js
# or simply: yarn dev (customize in package.json)
```
