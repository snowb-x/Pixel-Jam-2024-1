import Phaser from "phaser";
export default class Player extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} texture
   */
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.setScale(1);
  }
  setSprite() {
    scene.physics.add.sprite(x, y, texture);
  }
}
