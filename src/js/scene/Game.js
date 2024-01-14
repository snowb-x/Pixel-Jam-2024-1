import Phaser from "phaser";
export default class Game extends Phaser.Scene {
  score = 0;

  /** @type {Phaser.Physics.Arcade.Group} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Group} */
  food;

  /** @type {Phaser.Physics.Arcade.Group} */
  boom;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  cursors;

  foodCollectedText;

  constructor() {
    super("game");
  }

  init() {
    this.score = 0;
  }
  preload() {
    //load path from root
    this.load.image("sky", "assets/images/sky.png");
    this.load.spritesheet("player", "assets/images/tempPlayer.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    this.load.image("food", "assets/images/Pixel_Jam_logo_white.png");
    this.load.image("wall", "assets/images/platform.png");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.add.image(400, 300, "food").setScale(0.01);
    //this.add.image(400, 300, "player");
    this.player = this.physics.add.sprite(400, 520, "player").setScale(2);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idel",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 1, end: 1 }),
      frameRate: 10,
      repeat: -1,
    });
    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // //  The platforms group contains the ground and the 2 ledges we can jump on
    // this.platforms = this.physics.add.staticGroup();

    // //  Here we create the ground.
    // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // this.platforms.create(400, 600, "wall").setScale(2).refreshBody();

    // //  Now let's create some ledges
    // this.platforms.create(800, 400, "wall").setScale(2).setAngle(90);
    // this.platforms.create(0, 400, "wall").setScale(2).setAngle(90);
    // this.physics.add.collider(this.platforms, this.player);

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.food = this.physics.add.group({
      key: "food",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(this.player, this.food);

    //scorekeeper
    const style = { fill: "#000", fontSize: "24px" };
    this.foodCollectedText = this.add.text(20, 20, "Carrots: 0", style);

    //  Checks to see if the player overlaps with any of the food, if he does call the collectStar function
    this.physics.add.overlap(
      this.player,
      this.food,
      this.collectFood,
      null,
      this
    );
  }

  update(t, dt) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("idel");
    }

    this.food.children.iterate(function (child) {
      //  Give each star a slightly different bounce
      child.setScale(0.01);

      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

      if (child.y >= 800) {
        child.disableBody(true, true);
      }
    });
  }

  collectFood(player, food) {
    food.disableBody(true, true);
    //  Add and update the score
    this.score += 10;
    this.foodCollectedText.setText("Score: " + this.score);

    // if (food.countActive(true) === 0) {
    //   //  A new batch of stars to collect
    //   food.children.iterate(function (child) {
    //     child.enableBody(true, child.x, 0, true, true);
    //   });
    // }
  }
}
