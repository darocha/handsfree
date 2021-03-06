# Introduction
## What is handsfree.js?
Handsfree.js is a computer vision JavaScript library designed to help you add head and arm-tracked mouse pointers and handsfree interfaces to your projects. It's fast enough to work on mobile devices from 10+ meters away, even while tracking multiple people.

Handsfree.js is basically just a thin wrapper around [Tensorflow.js's PoseNet port](https://github.com/tensorflow/tfjs-models/tree/master/posenet) that:

- Initializes PoseNet
- Calculates where on the screen users are facing
- Approximates how far from the screen users are
- Has a plugin architecture, allowing the community to share functionality

::: tip 🐵 As you work with handsfree.js, keep the following in mind:
Anything - <i>literally anything</i> - that you can do on a mobile device right now with one finger is possible to do handsfree with handsfree.js!
:::

## How It Works

Handsfree.js adds a `<video>` and `<canvas>` tag to the page for each instance of `HandsfreeModule`. The `<video>` is used to contain the webcam feed (adaptable to either the front or rear camera), and the `<canvas>` contains the PoseNet overlay for debugging.

Poses are inferred on each frame (at a maximum rate of 60 frames per second), and a `HandsfreeModule.onUpdate()` method is available to run logic on each of these frames!

## About the Demos

All of the demos on the following page can be run by clicking the green **Run Demo** button after the code block. Additionally, you can run the demos manually via [your browsers JavaScript console](https://webmasters.stackexchange.com/a/77337)!

### The 1-liner
<br>
<img src="https://media.giphy.com/media/55vsITBRKRlaosFK7I/giphy.gif" width="100%">

The following is the simplest example, which will:

- Prompt you to start your webcam
- Place a debug panel with a stop button in the sidebar
- Position a cursor roughly over the part of the screen that you're looking at
- This _does not_ give any functionality to the cursor, we'll work on that next!

```js
handsfree = new HandsfreeModule({debug: true, autostart: true})
```

<demo />

::: tip 🐵 Demos carry over!
Once you start a demo, it'll follow you throughout the rest of the site. This allows you to mix and match code from various examples.
:::

::: warning 🙈 In case of crash:
If `handsfree` produces an error while you manually [edit it in the console](https://webmasters.stackexchange.com/a/77337), you can simply refresh the page!
:::
