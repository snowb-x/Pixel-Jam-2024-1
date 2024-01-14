import Phaser from "phaser";
export default class Game extends Phaser.Scene {
  score = 0;

  foodCollectedText;

  foodDropSpeed = 0;

  /** @type {Phaser.Physics.Arcade.Group} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Group} */
  food;

  totalFood = 0;

  sampleFood = [];

  /** @type {Phaser.Physics.Arcade.Group} */
  boom;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  playerSpeedBoost = 0;

  cursors;

  constructor() {
    super("game");
  }

  init() {
    this.score = 0;
    this.foodDropSpeed = 50;
    this.playerSpeedBoost = 0;
    this.totalFood = 10;
    this.sampleFood = [];
  }
  preload() {
    //load path from root
    this.load.image("sky", "assets/images/sky.png");
    this.load.spritesheet("player", "assets/images/tempPlayer.png", {
      frameWidth: 24,
      frameHeight: 24,
    });
    //this.load.image("food", "assets/images/Pixel_Jam_logo_white.png");
    this.load.spritesheet("food", "assets/images/Fruits_spritesheet.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.image("wall", "assets/images/platform.png");
  }

  create() {
    this.add.image(400, 300, "sky");
    this.add.image(400, 300, "food").setScale(0.01);
    //this.add.image(400, 300, "player");
    this.player = this.physics.add.sprite(400, 520, "player").setScale(2);
    this.player.setBounce(0);
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
      frame: [0, 1, 2, 3, 4],
      frameQuantity: this.totalFood,
      setXY: { x: 12, y: 850, stepX: 70 },
    });
    const foodSp = this.foodDropSpeed;
    this.food.children.iterate(function (child) {
      child.setScale(0.5);
      child.setVelocityY(foodSp);
      child.allowGravity = true;
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(
      this.player,
      this.food,
      this.collectFood,
      null,
      this
    );

    //scorekeeper
    const style = { fill: "#000", fontSize: "24px" };
    this.foodCollectedText = this.add.text(20, 20, "Score: 0", style);

    //  Checks to see if the player overlaps with any of the food, if he does call the collectStar function
    // this.physics.add.overlap(
    //   this.player,
    //   this.food,
    //   this.collectFood,
    //   null,
    //   this
    // );
  }

  update(t, dt) {
    const foodSp = this.foodDropSpeed;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160 - this.playerSpeedBoost);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160 + this.playerSpeedBoost);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("idel");
    }

    this.food.children.iterate(function (child) {
      child.setVelocityY(foodSp);
      //  Give each star a slightly different bounce
      //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      if (child.y >= 800) {
        child.disableBody(true, true);
      }
    });
    this.addNewWave();
  }

  collectFood(player, food) {
    //hide from display
    this.food.killAndHide(food);
    food.disableBody(true, true);
    //  Add and update the score
    this.score += 10;
    this.foodCollectedText.setText("Score: " + this.score);

    //points level handler

    // if points go higher speed goes faster

    if (this.score % 100 == 0 && this.foodDropSpeed < 1000) {
      this.setFoodDropSpeed(this.foodDropSpeed + 10);
    }

    //if player score over an amount add speed boost

    if (this.score % 50 == 0) {
      this.setPlayerSpeedBoost(this.playerSpeedBoost + 10);
    }
  }

  setFoodDropSpeed(newSpeed) {
    this.foodDropSpeed = newSpeed;
  }

  setPlayerSpeedBoost(newBoost) {
    this.playerSpeedBoost = newBoost;
  }

  setSmallFoodArray() {
    this.sampleFood = [];
    let randomPicker = 0;
    for (let i = 0; i < this.food.countActive(true); i++) {
      randomPicker = Phaser.Math.Between(0, 4);
      if (randomPicker == 0) {
        this.sampleFood.push(this.food.getChildren()[i]);
      } else {
        this.food.getChildren()[i].enableBody(true, 0, 900, true, true);
      }
    }
    Phaser.Actions.Shuffle(this.sampleFood);
  }

  addNewWave() {
    if (this.food.countActive(true) === 0) {
      //  A new batch of stars to collect
      this.food.children.iterate(function (child) {
        child.enableBody(true, child.x, -100, true, true);
      });
      const pickWave = Phaser.Math.Between(0, 2);

      switch (pickWave) {
        case 0:
          this.addCircleWaveStatic();
          break;
        case 1:
          this.addGridWave2();
          break;
        case 2:
          this.addGridWave3();
          break;
        default:
          break;
      }
    }
  }

  addCircleWaveStatic() {
    this.setSmallFoodArray();
    const circle = new Phaser.Geom.Circle(400, -500, 220);
    Phaser.Actions.PlaceOnCircle(this.sampleFood, circle);
  }

  addGridWave2() {
    this.setSmallFoodArray();
    var xStep = 500 / 10;
    var yStep = 100;
    var x = 0;
    var y = yStep;
    var count = 0;
    let randomPicker = Phaser.Math.Between(2, 8);
    this.sampleFood.forEach(function (child) {
      count++;
      x += xStep;
      if (count % 2 == 0) {
        y = yStep;
      } else {
        y += yStep;
      }
      if (count < 14) {
        child.enableBody(true, x + 800 / randomPicker, y - 300, true, true);
      } else {
        child.enableBody(true, 0, 900, true, true);
      }
    });
  }

  addGridWave3() {
    let newFoods = [];
    var xStep = 500 / 5;
    var yStep = 100;
    var x = 0;
    var y = yStep - 250;
    var count = 0;
    var countLine = 1;
    this.food.children.iterate((child) => {
      newFoods.push(child);
    });
    Phaser.Actions.Shuffle(newFoods);
    newFoods.forEach(function (child) {
      count++;
      x += xStep;

      if (count % 6 == 0) {
        countLine++;
        if (countLine % 2 == 0) {
          x = yStep * 1.5;
        } else {
          x = yStep / 1.5;
        }
        y += yStep;
      }

      child.enableBody(true, x + 50, y - 700, true, true);
    });
  }
}
