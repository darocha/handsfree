/**
 * A suite of polyfill togglers for testing with jest
 */
const MOCK = require('../mock')

/**
 * Suppress known warnings
 */
window.consoleWarn = console.warn
console.warn = function (message, ...args) {
  switch (message.slice(0, 30)) {
    case 'Registration of backend webgl ':
    case 'TypeError: gl.getExtension is ':
    break
    default:
      window.consoleWarn(message, ...args)
  }
}

/**
 * Suppress known error messages
 */
window.consoleError = console.error
console.error = function (message, ...args) {
  switch (message) {
    case 'IGNORE THIS ERROR':
    break
    default:
      window.consoleError(message, ...args)
  }
}

module.exports = {
  data: MOCK,

  mediaDevices: {
    support () {
      window.HTMLMediaElement.prototype.load = () => {}
      window.HTMLMediaElement.prototype.play = () => {}
      window.HTMLMediaElement.prototype.pause = () => {}
      window.HTMLMediaElement.prototype.addTextTrack = () => {}
      window.HTMLMediaElement.prototype.srcObject = {
        getTracks: () => [{stop: jest.fn()}]
      }
      navigator.mediaDevices = {
        getUserMedia: function () { return {} }
      }
    },
    unsupport () {navigator.mediaDevices = null}
  },

  posenet: {
    estimateSinglePose: jest.fn(() => MOCK.posenet.pose.single),
    estimateMultiplePoses: jest.fn(() => MOCK.posenet.pose.multiple)
  },

  WebGL: {
    support () {window.WebGLRenderingContext = true},
    unsupport () {window.WebGLRenderingContext = false}
  }
}
