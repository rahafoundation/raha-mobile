The Raha mobile app. Implemented in React Native with TypeScript.

NOTE: These instructions are all written for Mac OSX at the moment.

## Setup

### System dependencies

`react-native` depends on some system programs being available. Follow [the
installation instructions at `react-native`'s website for "Building Projects
with Native
Code"](https://facebook.github.io/react-native/docs/getting-started.html), but
stop before the "Creating a new application" section (we already created one!).

### Node dependencies

Before you run the app, first ensure `yarn` is installed (we use that instead of
`npm` to manage the dependencies and scripts listed in `package.json`):

```bash
npm install -g yarn
```

Then, `cd` into this directory and install the dependencies of the project:

```bash
yarn install
```

### Configuration

Finally, copy over either the prod or test config, whichever environment you'd
like to develop in.

```bash
yarn config:prod
# OR
yarn config:test
```

**NOTE**: These commands change configuration not just in JavaScript, but also
in the native apps; so if the app is running already, you'll need to rebuild it.

## Running the app...

### ...on an iPhone emulator:

Run `yarn start:ios` without an iPhone plugged into your computer, and it an
iPhone emulator running the code should start.

### ... on physical devices:

You need to set up your environment; please refer to [the instructions
here](https://facebook.github.io/react-native/docs/running-on-device.html). You
will need a USB cable to connect your phone to your computer.

Once you've done so, then plug in your device via USB and run the proper start
script below:

```bash
yarn start:ios
yarn start:android
```

Building can take a long time, so bear with it.

#### Troubleshooting

##### Android

- Ensure you are using Java JDK 1.8, as that's the only version supported.

## Other scripts

```bash
yarn test  # run tests
```

## Development environment

I recommend [using VSCode](https://code.visualstudio.com/) to edit your code
because its tooling for TypeScript and React Native is solid. In particular, I
recommend navigating to the recommended extensions and installing them:

![Screenshot of Recommended Extensions pane in
VSCode](setup-instructions/recommended-extensions.png)

I also recommend you run a script in VSCode that will tell you all the
TypeScript errors in your entire codebase as you code. To do so, go to Tasks >
Run Build Task, and then run the `tsc: watch - tsconfig.dev.json` script.

### Happy hacking!
