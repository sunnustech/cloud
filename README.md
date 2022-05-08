# INITIALIZING SEQUENCE

## Downloading sign up information

[](https://docs.google.com/spreadsheets/d/1e0zkoT6qQA8gBkd8QvvVuGR332QLotJ94dPJmIo-4BI) 0. do basic checks that data is correct

1. download registration csvs from Google Sheets
   - createTeams
   - createUsers
2. copy them into the csv folder and commit that change

## Command Sequence

| command  | description                  |
| -------- | ---------------------------- |
| yarn cu  | create users                 |
| yarn ct  | create teams                 |
| yarn au  | attach users to teams        |
| yarn att | assign TSS teams their slots |
| yarn cs  | create schedule              |

## Teardown sequence

| command  | description      |
| -------- | ---------------- |
| yarn dau | delete all users |
| yarn dat | delete all teams |
| yarn ds  | delete schedule  |

## Setup

Clone the repo into a folder called `cloud`. After cloning the repo, install
node packages by running `yarn` in three directories:

- `cloud/`
- `cloud/functions`
- `cloud/functions/src/tests`

Then make sure you're logged in to firebase:
1. `cd cloud/functions`
2. `yarn firebase login`

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
  console.debug('hello, server!')
  res.json({
    message: 'hello, requester!',
    serverReceived: req.body,
  })
})
```

2. Spin up a local emulator server

```bash
cd cloud/functions && yarn serve
```

Alternatively, if you run into an error, run this instead:

```bash
cd cloud/functions && yarn start:functions
```

3. Your terminal should should a list of local urls, one of which ending in
   `helloWorld`.

4. Go to that link in your browser. After loading, both your terminal and your
   browser should have some nice ouptut.

### Setting up client tester

To avoid needing to navigate to the link each time, you can use a simple
node.js request sender.

1. Create a new `.ts` file in `cloud/functions/src/tests/src` (reference `index.ts`)
2. Create a script in `package.json` to build and run it.
3. Test out the function as per stated above.
4. If the function you are testing requires inputs, you may embed them in the URL. Alternatively, you may download API Clients such as [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) and form a payload from there.

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

Supplying inputs from Postman example:

Using `createQR.ts` sa an example, the cloud function requires four parameters to be supplied. You may supply them in a JSON object in the GET request as follows:
```json
{
   "event": "Slide",
   "action": "resume",
   "facilitator": "Ryan",
   "score": "20"
}
```