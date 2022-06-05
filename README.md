# SunNUS 22 Cloud Repo :cloud:

![](/docs/images/sunnusofficial.jpg)

## Developed with:

<p align="center">
   <span>
      <img src="https://github.com/devicons/devicon/blob/master/icons/react/react-original-wordmark.svg" width="45px" alt="react" />
      <img src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-plain.svg" width="45px" alt="typescript" />
      <img src="https://github.com/devicons/devicon/blob/master/icons/firebase/firebase-plain-wordmark.svg" width="45px" alt="firebase" />
   </span>
</p>

## What is this repo for?

This repo is used to contain all the Firebase [cloud functions](https://firebase.google.com/docs/functions) for the SunNUS 22 mobile app. It facilitates backend functions to our application, thus allowing us develoepers to call them without invoking them from the application itself.

If you would like to learn more about the project in general or need a starting point, you may refer to the docs repo.

If you would like to learn more about how the frontend is built, you may refer to the app repo.

## Repo structure

This repo has two main directories: `functions` and `tests`.

`functions` contain the logic for the `onRequest` and `onCall` backend functions.

`tests` contain ...

## Setup

Pre-requisites:
- [node](https://nodejs.org/en/download/current/) **v16 and above**
- [yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) **strictly v1**
- [git](https://git-scm.com/downloads)
- Ensure that you are part of the project on Firebase.

More detailed explanations on installation process can be found in docs repo.

Clone the repo. A folder called `cloud` should appear. After cloning the repo, install
node packages by running `yarn` in these three directories:

- `cloud`
- `cloud/functions`

Then log in into firebase using the CLI: (assuming you're in `cloud`)
1. `cd functions`
2. `yarn firebase login`

## Writing your first function

Here's an example workflow of how I write a `helloWorld` cloud function.
1. Setting up server-side
2. Setting up client tester

### Setting up server-side

1. Export a new `onRequest` function `helloWorld` in
   `cloud/functions/src/helloWorld.ts`

```js
export const helloWorld = https.onRequest(async (req, res) => {
  console.debug('hello, server!')
  res.json({
    message: 'hello, requester!',
    serverReceived: req.body,
  })
})
```

2. Add it to the list of cloud functions to be used by exporting it in `cloud/functions/src/development.ts`.

3. Spin up a local emulator server

Linux/ MacOS:
```bash
cd functions && yarn serve
```

Windows:

```bash
cd functions && yarn start:functions
```

4. Your terminal should should a list of local urls, one of which ends in
   `helloWorld`.

![](/docs/images/helloWorldLink.png)

5. Go to that link in your browser. After loading, both your terminal and your
   browser should have the output as specified in the function above.

![](/docs/images/helloWorldRes.png)

6. Congrats! :tada: You've just written your very first cloud function!

### Setting up client tester

To avoid needing to navigate to the link each time, you can use a simple
node.js request sender.

1. Create a new `.ts` file in `cloud/tests/src` (reference `index.ts`)
2. Create a script in `cloud/tests/package.json` to build and run it. You may do so by creating an alias (i.e shortcut for the command)
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

Using `createQR.ts` as an example, the cloud function requires four parameters to be supplied. You may supply them in a JSON object in the GET request as follows:

```json
{
   "event": "Slide",
   "action": "resume",
   "facilitator": "Ryan",
   "score": "20"
}
```

![](docs/images/sample_onRequest_request.png)

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

## Downloading sign up information (for future devs)

[](https://docs.google.com/spreadsheets/d/1e0zkoT6qQA8gBkd8QvvVuGR332QLotJ94dPJmIo-4BI) 

1. Download registration csvs from Google Sheets
   - createTeams
   - createUsers
2. Place them into the `tests/src/csv` and commit the changes
   - Do ensure that the data is correct!