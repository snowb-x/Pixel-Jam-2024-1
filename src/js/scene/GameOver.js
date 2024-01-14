import Phaser from "phaser";
export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }

  init(data) {
    this.score = data.score;
    this.music = data.music;
  }

  preload() {
    this.load.image(
      "logo",
      "assets/images/Pixel_Jam_logo_yellow_eyes_open.png"
    );
    this.load.image("red", "https://labs.phaser.io/assets/particles/red.png");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const particles = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });

    const logo = this.physics.add.image(400, 300, "logo").setScale(0.1);

    logo.setVelocity(300, 300);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    particles.startFollow(logo);

    this.add
      .text(width * 0.5, height * 0.5 - 100, "Rat Feast!", {
        fontSize: 48,
      })
      .setOrigin(0.5);
    this.add
      .text(width * 0.5, height * 0.5, "GAME OVER", {
        fontSize: 60,
      })
      .setOrigin(0.5);
    this.add
      .text(width * 0.5, height * 0.5 + 100, "Score: " + this.score, {
        fontSize: 60,
      })
      .setOrigin(0.5);

    this.add
      .text(width * 0.5, height * 0.5 + 200, "Press SPACE to play!", {
        fontSize: 25,
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.music.stop();
      this.scene.start("game");
    });
  }
}
