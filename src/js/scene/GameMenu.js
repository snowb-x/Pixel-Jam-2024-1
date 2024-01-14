import Phaser from "phaser";
export default class GameMenu extends Phaser.Scene {
  constructor() {
    super("game-menu");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width * 0.5, height * 0.5, "Rat Feast!", {
        fontSize: 48,
      })
      .setOrigin(0.5);

    this.add
      .text(width * 0.5, height * 0.5 + 200, "Press SPACE to play!", {
        fontSize: 25,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game");
    });
  }
}
