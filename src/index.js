import Phaser from "phaser";
import Game from "./js/scene/Game.js";
import GameMenu from "./js/scene/GameMenu.js";
import GameOver from "./js/scene/GameOver.js";
import DvdIdel from "./js/scene/DvdIdel.js";
import "./style.css";
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [GameMenu, Game, GameOver, DvdIdel],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);
