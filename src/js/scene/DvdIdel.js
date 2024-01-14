import Phaser from "phaser";
export default class DvdIdel extends Phaser.Scene {
  constructor() {
    super("dvd");
  }
  init() {}
  preload() {
    //this.load.setBaseURL('https://labs.phaser.io');

    this.load.image("sky", "https://labs.phaser.io/assets/sky");
    //this.load.image("logo","https://labs.phaser.io/assets/sprites/phaser3-logo.png");
    this.load.image("logo", "src/assets/images/Pixel_Jam.png");
    this.load.image("red", "https://labs.phaser.io/assets/particles/red.png");
  }

  create() {
    this.add.image(400, 300, "sky");

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
  }
}
