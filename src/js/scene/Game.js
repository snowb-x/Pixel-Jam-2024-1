const fragmentShader2 = `
#ifdef GL_ES
precision mediump float;
#endif

// Love u Hanna E

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snoise(vec3 uv, float res) {
    const vec3 s = vec3(1e0, 1e2, 1e3);

    uv *= res;

    vec3 uv0 = floor(mod(uv, res)) * s;
    vec3 uv1 = floor(mod(uv + vec3(1.0), res)) * s;

    vec3 f = smoothstep(0.0, 1.0, fract(uv));

    vec4 v = vec4(uv0.x + uv0.y + uv0.z,
              uv1.x + uv0.y + uv0.z,
              uv0.x + uv1.y + uv0.z,
              uv1.x + uv1.y + uv0.z);

    vec4 r = fract(sin(v * 1e-1) * 1e3);
    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    r = fract(sin((v + uv1.z - uv0.z) * 1e-1) * 1e3);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    return mix(r0, r1, f.z) * 2.0 - 1.0;
}

void main() {
    vec2 p = -0.5 + gl_FragCoord.xy / resolution.xy;
    p.x *= resolution.x / resolution.y;
    float lp = .02/length(p);
    float ap = atan(p.x, p.y);

    float time = time*.04-pow(time, .8)*(1. + .1*cos(time*0.04))*2.;

    float r1 = 0.2;
    if(lp <= r1){
        ap -= time*0.1+lp*9.;
        lp = sqrt(1.-lp/r1)*0.5;
    }else{
        ap += time*0.1+lp*2.;
        lp -= r1;
    }

    lp = pow(lp*lp, 1./3.);

    p = lp*vec2(sin(ap), cos(ap));

    float color = 5.0 - (7.0 * lp);

    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + 0.5, 0.4 * lp, 0.5);

    float power = 2.0;
    for (int i = 0; i < 6; i++) {
        power *= 2.0;
        color += (1.5 / power) * snoise(coord + vec3(0.0, -0.05 * time*2.0, 0.01 * time*2.0), 16.0 * power);
    }
    color = max(color, 0.0);
    float c2 = color * color;
    float c3 = color * c2;
    vec3 fc = vec3(color * 0.34, c2*0.15, c3*0.85);
    float f = fract(time);
    //fc *= smoothstep(f-0.1, f, length(p)) - smoothstep(f, f+0.1, length(p));
    gl_FragColor = vec4(length(fc)*vec3(3,0,2)*0.04, 1.0);
}
`;
const fragmentShader7 = `
#ifdef GL_ES
precision mediump float;
#endif

// Love u Hanna E

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snoise(vec3 uv, float res) {
    const vec3 s = vec3(1e0, 1e2, 1e3);

    uv *= res;

    vec3 uv0 = floor(mod(uv, res)) * s;
    vec3 uv1 = floor(mod(uv + vec3(1.0), res)) * s;

    vec3 f = smoothstep(0.0, 1.0, fract(uv));

    vec4 v = vec4(uv0.x + uv0.y + uv0.z,
              uv1.x + uv0.y + uv0.z,
              uv0.x + uv1.y + uv0.z,
              uv1.x + uv1.y + uv0.z);

    vec4 r = fract(sin(v * 1e-1) * 1e3);
    float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    r = fract(sin((v + uv1.z - uv0.z) * 1e-1) * 1e3);
    float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);

    return mix(r0, r1, f.z) * 2.0 - 1.0;
}

void main() {
    vec2 p = -0.5 + gl_FragCoord.xy / resolution.xy;
    p.x *= resolution.x / resolution.y;
    float lp = .02/length(p);
    float ap = atan(p.x, p.y);

    float time = time*.04-pow(time, .8)*(1. + .1*cos(time*0.04))*2.;

    float r1 = 0.2;
    if(lp <= r1){
        ap -= time*0.1+lp*9.;
        lp = sqrt(1.-lp/r1)*0.5;
    }else{
        ap += time*0.1+lp*2.;
        lp -= r1;
    }

    lp = pow(lp*lp, 1./3.);

    p = lp*vec2(sin(ap), cos(ap));

    float color = 5.0 - (6.0 * lp);

    vec3 coord = vec3(atan(p.x, p.y) / 6.2832 + 0.5, 0.4 * lp, 0.5);

    float power = 2.0;
    for (int i = 0; i < 6; i++) {
        power *= 2.0;
        color += (1.5 / power) * snoise(coord + vec3(0.0, -0.05 * time*2.0, 0.01 * time*2.0), 16.0 * power);
    }
    color = max(color, 0.0);
    float c2 = color * color;
    float c3 = color * c2;
    vec3 fc = vec3(color * 0.34, c2*0.15, c3*0.85);
    float f = fract(time);
    //fc *= smoothstep(f-0.1, f, length(p)) - smoothstep(f, f+0.1, length(p));
    gl_FragColor = vec4(length(fc)*vec3(1,0,2)*0.04, 1.0);
}
`;

const fragmentShader = `
//@machine_shaman
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define FOV 90.
#define imod(n, m) n - (n / m * m)

#define VERTICES 12
#define FACES 20

float iX = .525731112119133606;
float iZ = .850650808352039932;

void icoVertices(out vec3[VERTICES] shape) {
    shape[0] = vec3(-iX,  0.0,    iZ);
    shape[1] = vec3( iX,  0.0,    iZ);
    shape[2] = vec3(-iX,  0.0,   -iZ);
    shape[3] = vec3( iX,  0.0,   -iZ);
    shape[4] = vec3( 0.0,  iZ,    iX);
    shape[5] = vec3( 0.0,  iZ,   -iX);
    shape[6] = vec3( 0.0, -iZ,    iX);
    shape[7] = vec3( 0.0, -iZ,   -iX);
    shape[8] = vec3(  iZ,   iX,  0.0);
    shape[9] = vec3( -iZ,   iX,  0.0);
    shape[10] = vec3(  iZ,  -iX,  0.0);
    shape[11] = vec3( -iZ,  -iX,  0.0);
}

mat2 rotate(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, s, -s, c);
}

float line(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * t);
}

vec3 v[12];
vec2 p[12];

// using define trick to render different triangles
// not possible in loop on glslsandbox
#define tri(a, b, c) min(min(min(d, line(uv, p[a], p[b])), line(uv, p[b], p[c])), line(uv, p[c], p[a]))

void main() {

    vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;

    uv.y += .08 * sin(uv.x + time);

    uv = floor(uv * 100.) / 100.;
    uv *= 3.;

    float t = 0.001 + abs(uv.y);
    float scl = 1. / t;
    vec2 st = uv * scl + vec2(0, scl + time);

    // setup vertices
    icoVertices(v);

    // project
    for (int i = 0; i < 12; i++) {
        v[i].xz *= rotate(time * 0.5);
        float scl = 1.0 / (1. + v[i].z * 0.2);
        float dist = distance(v[i].xyz, vec3(0, 0, -3));
        p[i] = v[i].xy * scl;// - vec2(0, 0);
    }

    // ico faces
    float d = 1.0;
    d = min(d, tri(0,  4,  1));
    d = min(d, tri(0,  9,  4));
    d = min(d, tri(9,  5,  4));
    d = min(d, tri(4,  5,  8));
    d = min(d, tri(4,  8,  1));
    d = min(d, tri(8,  10, 1));
    d = min(d, tri(8,  3,  10));
    d = min(d, tri(5,  3,  8));
    d = min(d, tri(5,  2,  3));
    d = min(d, tri(2,  7,  3));
    d = min(d, tri(7,  10, 3));
    d = min(d, tri(7,  6,  10));
    d = min(d, tri(7,  11, 6));
    d = min(d, tri(11, 0,  6));
    d = min(d, tri(0,  1,  6));
    d = min(d, tri(6,  1,  10));
    d = min(d, tri(9,  0,  11));
    d = min(d, tri(9,  11, 2));
    d = min(d, tri(9,  2,  5));
    d = min(d, tri(7,  2,  11));

    // color the scene
    vec3 col = vec3(0);

    col += mix(vec3(0), .5 + .5 * cos(time + st.x + 2. * st.y + vec3(0, 1, 2)), sign(cos(st.x * 10.)) * sign(cos(st.y * 20.))) * t * t;
    //col += smoothstep(0.3, 0., d);
    col *= smoothstep(0.0, 0.1, d);
    col += smoothstep(0.1, 0., d) * (.5 + .5 * cos(time + d * 20. + vec3(33, 66, 99)));
    col += abs(.01 / d);

    // thanks for the dithering effect :)
    col += floor(uv.y - fract(dot(gl_FragCoord.xy, vec2(0.5, 0.75))) * 10.0) * 0.1;

    gl_FragColor = vec4(col, 1.);
}`;
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
  background;
  shader;
  shader2;
  shader3;

  /**@type {Phaser.Sound} */
  currentTheme;

  constructor() {
    super("game");
  }

  init() {
    this.score = 0;
    this.bomb;
    this.foodDropSpeed = 90;
    this.playerSpeedBoost = 0;
    this.totalFood = 10;
    this.sampleFood = [];
    this.speedArr = [];
    this.cursors;
    this.currentTheme;
    this.particles;
    this.background;
    this.shader;
    this.shader2;
    this.shader3;
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
    this.load.image("speed3", "assets/images/Pixel_Jam_logo_white.png");
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

    //shaders
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
    //shader
    const baseShader = new Phaser.Display.BaseShader(
      "BufferShader",
      fragmentShader
    );
    this.shader = this.add.shader(baseShader, 400, 300, 800, 600);
    this.shader.setVisible(false);

    const baseShader2 = new Phaser.Display.BaseShader(
      "BufferShader1",
      fragmentShader2
    );
    this.shader2 = this.add.shader(baseShader2, 400, 300, 800, 600);
    this.shader2.setVisible(false);
    const baseShader3 = new Phaser.Display.BaseShader(
      "BufferShader2",
      fragmentShader7
    );
    this.shader3 = this.add.shader(baseShader3, 400, 300, 800, 600);
    this.shader3.setVisible(false);
    //images
    this.background = this.add.image(400, 300, "sky");

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
    this.speedArr.push(
      this.physics.add.sprite(150, -200, "speed3").setScale(0.03)
    );
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
      this.speedSpeedParty();
      if (this.foodDropSpeed == 200) {
        this.background.setVisible(false);
        this.shader2.setVisible(false);
        this.shader3.setVisible(false);
        this.shader.setVisible(true);
      }
      if (this.foodDropSpeed == 300) {
        this.background.setVisible(false);
        this.shader2.setVisible(true);
        this.shader3.setVisible(false);
        this.shader.setVisible(false);
      }
      if (this.foodDropSpeed == 450) {
        this.background.setVisible(true);
        this.background.setTint(0xef955f);
        this.shader2.setVisible(false);
        this.shader3.setVisible(false);
        this.shader.setVisible(false);
      }
    } else if (this.score % 300 == 0 && this.foodDropSpeed < 1000) {
      this.setFoodDropSpeed(this.foodDropSpeed + 10);
      this.upDateMusicThemePerLevel();
      this.speedSpeedParty();
      if (this.foodDropSpeed == 650) {
        this.background.setVisible(false);
        this.shader2.setVisible(false);
        this.shader3.setVisible(true);
        this.shader.setVisible(false);
      }
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

    this.scene.start("game-over", {
      score: this.score,
      music: this.currentTheme,
    });
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

    this.bomb.children.iterate((child) => {
      randomPicker = Phaser.Math.Between(0, 3);
      if (randomPicker == 0) {
        this.sampleFood.push(child);
      } else {
        child.enableBody(true, 0, 900, true, true);
      }
    });
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

  setFullFoodBombArray() {
    this.sampleFood = [];
    let randomPicker = 0;

    this.bomb.children.iterate((child) => {
      randomPicker = Phaser.Math.Between(0, 3);
      if (randomPicker == 0) {
        this.sampleFood.push(child);
      } else {
        child.enableBody(true, 0, 900, true, true);
      }
    });
    for (let i = 0; i < this.food.countActive(true); i++) {
      this.sampleFood.push(this.food.getChildren()[i]);
    }
    Phaser.Actions.Shuffle(this.sampleFood);
  }

  speedSpeedParty() {
    const randomPicker = Phaser.Math.Between(0, 2);
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
      if (this.bomb.countActive(true) === 0) {
        //  A new batch of stars to collect
        this.bomb.children.iterate(function (child) {
          child.enableBody(true, child.x, -100, true, true);
        });
      }
      let pickWave = Phaser.Math.Between(0, 3);

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
        case 3:
          this.addCircleWaveMultiStatic();
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
  addCircleWaveMultiStatic() {
    this.setFullFoodBombArray();

    const group1 = [];
    for (let i = 30; i < this.sampleFood.length; i++) {
      group1.push(this.sampleFood[i]);
    }
    const group2 = [];
    for (let i = 15; i < 30; i++) {
      group2.push(this.sampleFood[i]);
    }
    const group3 = [];
    for (let i = 5; i < 15; i++) {
      group3.push(this.sampleFood[i]);
    }
    const group4 = [];
    for (let i = 0; i < 5; i++) {
      group4.push(this.sampleFood[i]);
    }
    const circle1 = new Phaser.Geom.Circle(400, -500, 350);
    const circle2 = new Phaser.Geom.Circle(400, -500, 250);
    const circle3 = new Phaser.Geom.Circle(400, -500, 150);
    const circle4 = new Phaser.Geom.Circle(400, -500, 70);
    Phaser.Actions.PlaceOnCircle(group1, circle1);
    Phaser.Actions.PlaceOnCircle(group2, circle2);
    Phaser.Actions.PlaceOnCircle(group3, circle3);
    Phaser.Actions.PlaceOnCircle(group4, circle4);
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
