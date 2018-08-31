/**
 * calculations/XY.js
 * At 13.6 units away
 */

// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
// 🚨 COMMENT THIS OUT WHEN NOT IN USE 🚨
// 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
const $x = document.querySelector('#x')
const $y = document.querySelector('#y')
const $z = document.querySelector('#z')
const $yaw = document.querySelector('#yaw')
const $pitch = document.querySelector('#pitch')
const $roll = document.querySelector('#roll')
const $eyeDistance = document.querySelector('#eye-distance')
const $leftEyeNoseDistance = document.querySelector('#left-eye-nose-distance')
const $rightEyeNoseDistance = document.querySelector('#right-eye-nose-distance')
const $magicNumber = document.querySelector('#magic-number')

module.exports = function (Handsfree) {
  Handsfree.prototype.calculateXY = function () {
    this.poses && this.poses.forEach((pose, index) => {
      // The cursors predicted x,y
      let x
      let y
      // Distance away from screen in units
      let z
      // Head yaw/pitch/roll
      let yaw
      let pitch
      let roll
      // Distance formula
      let a
      let b
      // Distance between eyes and nose
      let lEyeNoseDist
      let rEyeNoseDist
      // For calculating slopes
      let deltaY
      let deltaX
      // Keypoints
      let nose = pose.keypoints[0].position
      let leftEye = pose.keypoints[1].position
      let rightEye = pose.keypoints[2].position
      // Used to help map a point on the canvas to a point on the window
      let canvasRatio = this.cache.window.canvasRatio

      /**
       * Position the cursor assuming no head rotation
       */
      x = (this.canvas.width - pose.eyeCenter.x) * canvasRatio.width
      y = (pose.eyeCenter.y) * canvasRatio.height
      z = pose.distanceFromScreen.toFixed(2)

      /**
       * Calculate Roll
       */
      deltaY = pose.keypoints[2].position.y - pose.keypoints[1].position.y
      deltaX = pose.keypoints[1].position.x - pose.keypoints[2].position.x
      roll = Handsfree.toDegrees(Math.atan2(deltaY, deltaX))

      /**
       * Calculate Eye-Nose distances
       */
      a = pose.keypoints[0].position.x - pose.keypoints[1].position.x
      b = pose.keypoints[0].position.y - pose.keypoints[1].position.y
      lEyeNoseDist = Math.sqrt(a*a + b*b)
      a = pose.keypoints[0].position.x - pose.keypoints[2].position.x
      b = pose.keypoints[0].position.y - pose.keypoints[2].position.y
      rEyeNoseDist = Math.sqrt(a*a + b*b)

      /**
       * Store values
       */
      this.poses[index].pointedAt = {x, y}

      /**
       * Debug
       */
      // 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
      // 🚨 COMMENT THIS OUT WHEN NOT IN USE 🚨
      // 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
      $x.innerText = Math.floor(x)
      $y.innerText = Math.floor(y)
      $z.innerText = z
      $yaw.innerText = yaw
      $pitch.innerText = pitch
      $roll.innerText = roll.toFixed(2)

      $eyeDistance.innerText = pose.eyeDistance.toFixed(0)
      $leftEyeNoseDistance.innerText = lEyeNoseDist.toFixed(2)
      $rightEyeNoseDistance.innerText = rEyeNoseDist.toFixed(2)
      $magicNumber.innerText = (lEyeNoseDist - rEyeNoseDist).toFixed(4)
    })
  }

  /**
   * Converts radians to degrees
   * @param {NUMBER} radian
   */
  Handsfree.toDegrees = function(radian) {
    return radian * (180 / Math.PI)
  }

  // /**
  //  * Entry point for our hacky calculations
  //  * - Calculates "pointedAt" for each pose
  //  */
  // Handsfree.prototype.calculateXY = function () {
  //   this.poses && this.poses.forEach((pose, index) => {
  //     const nose = pose.keypoints[0]
  //     const envWidth = window.outerWidth
  //     const envHeight = window.outerHeight
  //     let poseAverages = 0
  //
  //     // Helps map a point on the.canvas to a point on the window
  //     const ratio = {
  //       width: envWidth / this.canvas.width,
  //       height: envHeight / this.canvas.height
  //     }
  //
  //     // First, let's get where on the screen we are if looking dead ahead
  //     // The canvas is mirrored, so left needs to be flipped
  //     let x = -nose.position.x * ratio.width + envWidth
  //     let y = nose.position.y * ratio.height
  //
  //     // @FIXME Now let's adjust for rotation
  //     let yaw = this.calculateHeadYaw(pose)
  //     let pitch = this.calculateHeadPitch(pose)
  //     x += yaw * window.outerWidth / 2
  //     y += pitch * window.outerHeight / 2
  //
  //     // Let's add it to the stack
  //     this.poseStack[index] = this.poseStack[index] || []
  //     this.poseStack[index].push({x, y})
  //     if (this.poseStack[index].length > this.settings.poseStackSize) this.poseStack[index].shift()
  //
  //     // Finally let's get the average
  //     poseAverages = this.averagePoseStack(this.poseStack[index])
  //     x = poseAverages.x
  //     y = poseAverages.y
  //
  //     // Assign values
  //     pose.pointedAt = {x, y}
  //     pose.angles = {pitch, yaw}
  //     this.poses[index] = pose
  //   })
  // }
  //
  // /**
  //  * @FIXME Get the head's Yaw (looking left/right)
  //  * 👻 Let's unit test this AFTER we agree on a solid algorithm
  //  * 🧙 CAUTION HERO, FOR HERE BE 🐉 DRAGONS 🐉
  //  *
  //  * - 0* is you looking straight ahead
  //  * - 90* would be your head turned to the right
  //  * - -90* would be you looking to the left
  //  *
  //  * My basic algorithm is:
  //  *  1. What is the x distance from the nose to each eye?
  //  *
  //  *  2. The difference between these distances determines the angle
  //  *    - For this algorithm, angles are between -90 and 90 (looking left and right)
  //  *
  //  * Problems with this aglorithm:
  //  * - All of it
  //  */
  // Handsfree.prototype.calculateHeadYaw = function (pose) {
  //   const points = pose.keypoints
  //   let yaw = 0
  //   let distanceRatio
  //   let sideLookingAt
  //   let totalDistance
  //
  //   // 1. What is the x distance from the nose to each eye?
  //   let eyeNoseDistance = {
  //     left: Math.abs(points[1].position.x - points[0].position.x),
  //     right: Math.abs(points[2].position.x - points[0].position.x)
  //   }
  //   totalDistance = eyeNoseDistance.left + eyeNoseDistance.right
  //
  //   // 2. The difference between these distances determines the angle
  //   if (eyeNoseDistance.left > eyeNoseDistance.right) {
  //     distanceRatio = 1 - eyeNoseDistance.right / eyeNoseDistance.left
  //     sideLookingAt = 1
  //   } else {
  //     distanceRatio = 1 - eyeNoseDistance.left / eyeNoseDistance.right
  //     sideLookingAt = -1
  //   }
  //
  //   // Try to tame this beast into a radian
  //   yaw = ((distanceRatio * 90 * sideLookingAt) * Math.PI / 180)
  //
  //   return yaw
  // }
  //
  // /**
  //  * @FIXME Get the head's Pitch (looking up/down)
  //  * 👻 Let's unit test this AFTER we agree on a solid algorithm
  //  * 🧙 CAUTION HERO, FOR HERE BE 🐉 DRAGONS 🐉
  //  *
  //  * - 0* is you looking straight ahead
  //  * - 90* would be your head turned upwards
  //  * - -90* would be you head turned downwards
  //  *
  //  * My basic algorithm is:
  //  *  1. Calculate the average Y's for both ears (or whichever is visible)
  //  *  2. Calculate the distance the eyes are apart
  //  *  3. Calculate the distance between the nose and the averaged ear Y
  //  */
  // Handsfree.prototype.calculateHeadPitch = function (pose) {
  //   let yEarAverage = 0
  //   let numEarsFound = 0
  //   let eyeDistance = 0
  //   let distanceRatio = 0
  //   let points = pose.keypoints
  //
  //   // 1. Calculate the average Y's for both ears (or whichever is visible)
  //   if (points[3].score >= this.settings.posenet.minPartConfidence) {
  //     numEarsFound++
  //     yEarAverage += points[3].position.y
  //   }
  //   if (points[4].score >= this.settings.posenet.minPartConfidence) {
  //     numEarsFound++
  //     yEarAverage += points[4].position.y
  //   }
  //   yEarAverage = yEarAverage / numEarsFound
  //
  //   // 2. Calculate the distance the eyes are apart
  //   // - I am literally making this up as I go
  //   eyeDistance = points[1].position.x - points[2].position.x
  //   distanceRatio = (points[0].position.y - yEarAverage) / eyeDistance
  //
  //   return (90 * distanceRatio) * Math.PI / 180
  // }
  //
  // /**
  //  * @FIXME Averages the pose stacks to reduce "wobble"
  //  *
  //  * @param {Object} poseStack The posestack to average out
  //  *
  //  * @return {Object} The averaged {x, y}
  //  */
  // Handsfree.prototype.averagePoseStack = function (poseStack) {
  //   let x = 0
  //   let y = 0
  //
  //   poseStack.forEach(pose => {
  //     x += pose.x
  //     y += pose.y
  //   })
  //
  //   x = x / poseStack.length
  //   y = y / poseStack.length
  //
  //   return {x, y}
  // }
}
