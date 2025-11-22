import Paddle from '../model/Paddle.js';
import Ball from '../model/Ball.js';
import Level from '../model/Level.js'; 
import InputHandler from './InputHandler.js';
import Renderer from '../view/Renderer.js';
import CollisionDetector from './CollisionDetector.js';
import AudioController from './AudioController.js';
import GameState, { GAMESTATE } from '../model/GameState.js';
import Player from '../model/Player.js';
import HUD from '../view/HUD.js';
import GameOverView from '../view/GameOverView.js';
import MainMenuView from '../view/MainMenuView.js'; 
import OptionsView from '../view/OptionsView.js';
import StorageManager from '../utils/StorageManager.js';
import PowerUp, { POWERUP_TYPES } from '../model/PowerUp.js';
import SpriteManager from './SpriteManager.js'; 

export default class GameController {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gameWidth = canvas.width;
        this.gameHeight = canvas.height;

        this.gameState = new GameState();
        this.player = new Player();
        this.currentLevelNum = 1; 
        
        this.balls = [];
        this.powerUps = [];
        this.activeEffects = [];
        
        this.paddle = new Paddle(this.gameWidth, this.gameHeight);
        this.balls.push(new Ball(this.gameWidth, this.gameHeight));
        this.level = new Level(this.gameWidth, this.gameHeight); 

        this.audioController = new AudioController();
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.inputMode = 'KEYBOARD';

        this.spriteManager = new SpriteManager();
        this.renderer = new Renderer(this.ctx, this.gameWidth, this.gameHeight, this.spriteManager);
        
        
        this.hud = new HUD(this.gameWidth, this.gameHeight, this.spriteManager);
        
        this.gameOverView = new GameOverView(this.gameWidth, this.gameHeight);
        this.mainMenuView = new MainMenuView(this.gameWidth, this.gameHeight);
        this.optionsView = new OptionsView(this.gameWidth, this.gameHeight);
        this.storageManager = new StorageManager();
        this.collisionDetector = new CollisionDetector();
        
        this.inputHandler = new InputHandler(this); 
        this.lastTime = 0;
    }

    start() { requestAnimationFrame(this.gameLoop.bind(this)); }

    handleMenuSelection() {
        const selection = this.mainMenuView.getSelection();
        switch(selection) {
            case "NUEVA PARTIDA":
                this.storageManager.clearProgress();
                this.startLevel();
                this.audioController.playMusic(0);
                break;
            case "CONTINUAR":
                if (this.storageManager.hasSavedGame()) {
                    const savedData = this.storageManager.loadProgress();
                    this.currentLevelNum = savedData.level;
                    this.player.lives = savedData.lives;
                    this.player.score = savedData.score;
                    this.player.puntosMejora = savedData.puntosMejora;
                    this.startLevel(); 
                    this.audioController.playMusic(1);
                } else {
                    this.audioController.play('bottomHit');
                }
                break;
            case "OPCIONES":
                this.gameState.set(GAMESTATE.OPTIONS);
                break;
            case "SALIR":
                window.location.href = "https://google.com";
                break;
        }
    }

    startLevel() {
        this.gameState.set(GAMESTATE.RUNNING);
        this.balls = [new Ball(this.gameWidth, this.gameHeight)];
        this.paddle.reset();
        this.powerUps = [];
        this.activeEffects = [];
        this.level = new Level(this.gameWidth, this.gameHeight);
    }

    resetGame() {
        this.startLevel();
        this.audioController.playMusic(0);
    }

    spawnPowerUp(position) {
        this.powerUps.push(new PowerUp(position));
    }

    activatePowerUp(powerUp) {
        this.audioController.play('powerup');
        if (powerUp.type === POWERUP_TYPES.SHIELD) {
            this.player.activeShield = true;
            return;
        }
        if (powerUp.type === POWERUP_TYPES.MULTIBALL) {
            const newBalls = [];
            this.balls.forEach(ball => {
                newBalls.push(new Ball(this.gameWidth, this.gameHeight, ball.position));
                newBalls.push(new Ball(this.gameWidth, this.gameHeight, ball.position));
            });
            newBalls.forEach(b => b.speed.x = (Math.random() * 6) - 3);
            this.balls = [...this.balls, ...newBalls];
            return;
        }
        
        // --- CAMBIO 2: Guardar duración total para la barra del HUD ---
        this.activeEffects.push({
            type: powerUp.type,
            timeLeft: powerUp.duration,
            totalDuration: powerUp.duration // <--- ESTO ARREGLA LA BARRA
        });
        this.applyEffect(powerUp.type, true);
    }

    applyEffect(type, isActive) {
        switch(type) {
            case POWERUP_TYPES.MEGA_PADDLE:
                this.paddle.width = isActive ? 192 : 128;
                break;
            case POWERUP_TYPES.MINI_PADDLE:
                this.paddle.width = isActive ? 64 : 128;
                break;
            case POWERUP_TYPES.INVERTED:
                this.paddle.invertedControls = isActive;
                break;
            case POWERUP_TYPES.EXPLOSIVE:
                this.balls.forEach(b => b.isExplosive = isActive);
                break;
            case POWERUP_TYPES.HEAVY_BALL:
                this.balls.forEach(b => b.isHeavy = isActive);
                break;
        }
    }

    gameLoop(timestamp) {
        let deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        try {
            this.update(deltaTime);
            this.draw();
        } catch (error) {
            console.error("Error en GameLoop:", error);
            return; 
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    // ... (adjustMusicVol, adjustSFXVol, togglePause, returnToMenu, launchBall iguales) ...
    
    adjustMusicVol(amount) {
        this.musicVolume += amount;
        this.musicVolume = Math.round(Math.max(0, Math.min(1, this.musicVolume)) * 10) / 10;
        this.audioController.setMusicVolume(this.musicVolume);
    }

    adjustSFXVol(amount) {
        this.sfxVolume += amount;
        this.sfxVolume = Math.round(Math.max(0, Math.min(1, this.sfxVolume)) * 10) / 10;
        this.audioController.setSFXVolume(this.sfxVolume);
    }

    togglePause() {
        if (this.gameState.current === GAMESTATE.RUNNING) {
            this.gameState.set(GAMESTATE.PAUSED);
            const dataToSave = {
                level: this.currentLevelNum,
                lives: this.player.lives,
                score: this.player.score,
                puntosMejora: this.player.puntosMejora
            };
            this.storageManager.saveProgress(dataToSave);
        } else if (this.gameState.current === GAMESTATE.PAUSED) {
            this.gameState.set(GAMESTATE.RUNNING);
        }
    }

    toggleInputMode() {
        if (this.inputMode === 'KEYBOARD') {
            this.inputMode = 'MOUSE';
        } else {
            this.inputMode = 'KEYBOARD';
        }
    }
        
    returnToMenu() {
        this.gameState.set(GAMESTATE.MENU);
        this.resetGame();
    }

    launchBall() {
        if (this.gameState.current === GAMESTATE.RUNNING) {
            this.balls.forEach(ball => ball.launch());
        }
    }

    update(deltaTime) {
        if (this.gameState.current !== GAMESTATE.RUNNING) return;

        this.paddle.update(deltaTime);
        
        this.balls.forEach(ball => ball.update(deltaTime, this.paddle));
        this.balls = this.balls.filter(ball => ball.position.y <= this.gameHeight);

        this.level.update(deltaTime);
        this.powerUps.forEach(p => p.update(deltaTime));
        this.powerUps = this.powerUps.filter(p => !p.markedForDeletion);

        this.activeEffects.forEach(effect => {
            effect.timeLeft -= deltaTime;
            if (effect.type === POWERUP_TYPES.EXPLOSIVE) this.balls.forEach(b => b.isExplosive = true);
            if (effect.type === POWERUP_TYPES.HEAVY_BALL) this.balls.forEach(b => b.isHeavy = true);
            
            if (effect.timeLeft <= 0) {
                this.applyEffect(effect.type, false);
            }
        });
        this.activeEffects = this.activeEffects.filter(e => e.timeLeft > 0);

        this.collisionDetector.detect(this.balls, this.paddle, this.level, this.audioController, this);

        if (this.level.bricks.length === 0) {
            this.audioController.play('win');
            this.currentLevelNum++;
            this.startLevel(); 
        }

        if (this.balls.length === 0) {
            const isDead = this.player.loseLife();
            
            if (this.player.lives <= 0) {
                this.audioController.play('lose');
                this.gameState.set(GAMESTATE.GAMEOVER);
            } else {
                this.balls = [new Ball(this.gameWidth, this.gameHeight)];
                this.paddle.reset();
                this.activeEffects = [];
                if (isDead) this.audioController.play('bottomHit');
            }
        }
    }

    draw() {
        this.renderer.clear();

        if (this.gameState.current === GAMESTATE.MENU) {
            this.mainMenuView.draw(this.ctx);
        } 
        else if (this.gameState.current === GAMESTATE.OPTIONS) {
            this.optionsView.draw(this.ctx, this.musicVolume, this.sfxVolume, this.inputMode); 
        }
        else if (this.gameState.current === GAMESTATE.RUNNING || this.gameState.current === GAMESTATE.PAUSED) {
            this.renderer.draw([...this.balls, this.paddle, ...this.level.bricks, ...this.powerUps]);
            
            const darkness = this.activeEffects.find(e => e.type === POWERUP_TYPES.DARKNESS);
            if (darkness) {
                this.renderer.drawDarkness(this.paddle, this.balls);
            }

            this.hud.draw(this.ctx, this.player, this.activeEffects || [], this.currentLevelNum);

            if (this.gameState.current === GAMESTATE.PAUSED) {
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
                this.ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
                this.ctx.font = "bold 60px 'Courier New'";
                this.ctx.fillStyle = "white";
                this.ctx.textAlign = "center";
                this.ctx.fillText("PAUSA", this.gameWidth / 2, this.gameHeight / 2 - 20);
                this.ctx.font = "20px 'Courier New'";
                this.ctx.fillStyle = "#ccc";
                this.ctx.fillText("Presiona 'P' para Continuar", this.gameWidth / 2, this.gameHeight / 2 + 40);
                this.ctx.fillText("Presiona 'Q' para Menú Principal", this.gameWidth / 2, this.gameHeight / 2 + 80);
            }
        } 
        else if (this.gameState.current === GAMESTATE.GAMEOVER) {
            this.renderer.draw([...this.balls, this.paddle, ...this.level.bricks]);
            this.gameOverView.draw(this.ctx, this.player.score, this.currentLevelNum);
        }
    }
}