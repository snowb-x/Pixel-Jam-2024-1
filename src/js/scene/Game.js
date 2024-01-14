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
  bomb;

  /** @type {Phaser.Physics.Arcade.Group} */
  boom;

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  playerSpeedBoost = 0;

  cursors;

  themes = [];

  collectSound;

  speedArr = [];

  particles;

  /**@type {Phaser.Sound} */
  currentTheme;

  constructor() {
    super("game");
  }

  init() {
    this.score = 0;
    this.foodDropSpeed = 90;
    this.playerSpeedBoost = 0;
    this.totalFood = 10;
    this.sampleFood = [];
  }
  preload() {
    //load path from root
    this.load.image("sky", "assets/images/sky.png");
    this.load.spritesheet("player", "assets/images/Player_spritesheet.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    //this.load.image("food", "assets/images/Pixel_Jam_logo_white.png");
    this.load.spritesheet("food", "assets/images/Fruits_spritesheet.png", {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.image("bomb", "assets/images/bomb.png");
    this.load.image("wall", "assets/images/platform.png");
    this.load.image("speed1", "assets/images/speed1.png");
    this.load.image("speed2", "assets/images/fast1.png");
    this.load.image("red", "https://labs.phaser.io/assets/particles/red.png");

    //audio
    this.load.audio(
      "audio1",
      "assets/audios/cruising-down-8bit-lane-159615.mp3"
    );
    this.load.audio("audio2", "assets/audios/digital-love-127441.mp3");
    this.load.audio("audio3", "assets/audios/lady-of-the-80x27s-128379.mp3");
    this.load.audio(
      "audio4",
      "assets/audios/on-the-road-to-the-eighties_59sec-177566.mp3"
    );
    this.load.audio(
      "audio5",
      "assets/audios/on-the-road-to-the-eighties_30sec-177565.mp3"
    );
    this.load.audio("collect", "assets/audios/Fruit_collect_1.wav");
  }

  create() {
    //audios
    this.collectSound = this.sound.add("collect", { loop: false });
    this.themes.push(this.sound.add("audio1", { loop: true }));
    this.themes.push(this.sound.add("audio2", { loop: true }));
    this.themes.push(this.sound.add("audio3", { loop: true }));
    this.themes.push(this.sound.add("audio4", { loop: true }));
    this.themes.push(this.sound.add("audio5", { loop: true }));
    this.currentTheme = this.themes[0];
    this.playMusic(this.themes[0]);
    //images
    this.add.image(400, 300, "sky");
    //this.add.image(400, 300, "food").setScale(0.01);
    // Speed up images
    this.particles = this.add.particles(0, 0, "red", {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: "ADD",
    });
    this.particles.stop();
    this.speedArr.push(this.physics.add.sprite(400, -200, "speed1"));
    this.speedArr.push(this.physics.add.sprite(150, -200, "speed2"));
    this.speedArr.forEach((child) => {
      child.setVelocity(300, 300);
      child.setBounce(1, 1);
      child.setCollideWorldBounds(true);
      //particles.startFollow(child);
      //hide from display
      child.disableBody(true, true);
    });

    //player
    //this.add.image(400, 300, "player");
    this.player = this.physics.add.sprite(400, 520, "player").setScale(1);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "idel",
      frames: [{ key: "player", frame: 1 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 2, end: 2 }),
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

    const foodSp = this.foodDropSpeed;
    this.bomb = this.physics.add.group({
      key: "bomb",
      repeat: 10,
      setXY: { x: 400, y: 850 },
    });
    this.bomb.children.iterate(function (child) {
      child.setScale(0.5);
      child.setVelocityY(foodSp);
      child.allowGravity = true;
    });
    this.food = this.physics.add.group({
      key: "food",
      frame: [0, 1, 2, 3, 4],
      frameQuantity: this.totalFood,
      setXY: { x: 12, y: 850, stepX: 70 },
    });
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
    this.physics.add.collider(this.player, this.bomb, this.endGame, null, this);

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

    //disable the food and bomb
    this.food.children.iterate(function (child) {
      child.setVelocityY(foodSp);
      //  Give each star a slightly different bounce
      //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      if (child.y >= 800) {
        child.disableBody(true, true);
      }
    });
    this.bomb.children.iterate(function (child) {
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

    //play collect sound
    this.collectSound.play();

    //points level handler

    // if points go higher food speed goes faster

    if (this.score % 100 == 0 && this.foodDropSpeed < 500) {
      this.setFoodDropSpeed(this.foodDropSpeed + 10);
      this.upDateMusicThemePerLevel();
      this.seedSpeedParty();
    } else if (this.score % 300 == 0 && this.foodDropSpeed < 1000) {
      this.setFoodDropSpeed(this.foodDropSpeed + 10);
      this.upDateMusicThemePerLevel();
      this.seedSpeedParty();
    }

    //if player score over an amount add speed boost to player

    if (this.score % 50 == 0) {
      this.setPlayerSpeedBoost(this.playerSpeedBoost + 10);
    }
  }

  endGame(player, bomb) {
    this.bomb.killAndHide(bomb);
    bomb.disableBody(true, true);
    const style = { fill: "#000", fontSize: "24px" };
    this.add.text(400, 300, "GameOver", style);
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
    for (let i = 0; i < this.bomb.countActive(true); i++) {
      randomPicker = Phaser.Math.Between(0, 3);
      if (randomPicker == 0) {
        this.sampleFood.push(this.bomb.getChildren()[i]);
      } else {
        this.bomb.getChildren()[i].enableBody(true, 0, 900, true, true);
      }
    }
    Phaser.Actions.Shuffle(this.sampleFood);
  }

  seedSpeedParty() {
    const randomPicker = Phaser.Math.Between(0, 1);
    this.speedArr[randomPicker].enableBody(true, 400, -200, true, true);
    this.speedArr[randomPicker].setVelocity(300, 300);
    this.particles.start();
    this.particles.startFollow(this.speedArr[randomPicker]);
    const speed1 = this.speedArr[randomPicker];
    const particle1 = this.particles;
    this.time.delayedCall(
      5000,
      () => {
        speed1.disableBody(true, true);
        particle1.stop();
      },
      [],
      this
    );
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
    let randomPicker = Phaser.Math.Between(2, 8);
    this.bomb.children.iterate((child) => {
      randomPicker = Phaser.Math.Between(0, 2);
      if (randomPicker == 0) {
        newFoods.push(child);
      } else {
        child.enableBody(true, 0, 900, true, true);
      }
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
  playMusic(musicKey) {
    this.currentTheme.stop();
    this.currentTheme = musicKey;
    this.currentTheme.play();
  }

  //music changes as player gets more points
  upDateMusicThemePerLevel() {
    if (this.foodDropSpeed == 950) {
      this.playMusic(this.themes[4]);
    } else if (this.foodDropSpeed == 500) {
      this.playMusic(this.themes[3]);
    } else if (this.foodDropSpeed == 300) {
      this.playMusic(this.themes[2]);
    } else if (this.foodDropSpeed == 100) {
      //this.themes[0].stop();
      this.playMusic(this.themes[1]);
    }
  }
}
