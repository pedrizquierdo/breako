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
import Particle from '../model/Particle.js';

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
        this.particles = [];
        
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
                this.storageManager.clearProgress(); // Borrar guardado viejo
                
                this.currentLevelNum = 1; // Volver al nivel 1
                this.player.reset();      // Reiniciar vidas, score y monedas
                // -----------------------------------------

                this.startLevel();        // Construir el nivel
                this.audioController.playMusic(0);
                break;
            case "CONTINUAR":
                if (this.storageManager.hasSavedGame()) {
                    const savedData = this.storageManager.loadProgress();
                    
                    // Restaurar estadísticas del jugador
                    this.currentLevelNum = savedData.level;
                    this.player.lives = savedData.lives;
                    this.player.score = savedData.score;
                    this.player.puntosMejora = savedData.puntosMejora;
                    
                    // 1. Iniciar nivel (esto crea uno random por defecto)
                    this.startLevel(); 

                    // 2. SI hay datos de ladrillos, sobrescribimos el nivel random
                    if (savedData.bricks && savedData.bricks.length > 0) {
                        this.level.loadFromSave(savedData.bricks);
                    }
                    
                    this.audioController.playMusic(1);
                } else {
                    console.log("No hay partida guardada");
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
            
            // 1. Extraer datos de los ladrillos actuales
            const bricksData = this.level.bricks.map(brick => ({
                x: brick.position.x,
                y: brick.position.y,
                resistencia: brick.resistencia
            }));

            // 2. Guardar todo en el objeto dataToSave
            const dataToSave = {
                level: this.currentLevelNum,
                lives: this.player.lives,
                score: this.player.score,
                puntosMejora: this.player.puntosMejora,
                bricks: bricksData // <--- AÑADIDO
            };
            
            this.storageManager.saveProgress(dataToSave);
            console.log("Juego Guardado con estado del nivel.");
            
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

    triggerShake(amount) {
        this.renderer.shake(amount);
    }

    spawnParticles(position, color = '#FFFFFF') {
    for (let i = 0; i < 8; i++) { // 8 partículas por ladrillo
        this.particles.push(new Particle(position, color));
    }
}

    handleGameOverSelection() {
        const selection = this.gameOverView.getSelection();
        
        switch(selection) {
            case "NUEVA PARTIDA":
                // Borramos progreso y empezamos de cero
                this.storageManager.clearProgress();
                this.currentLevelNum = 1;
                this.player.reset();
                
                this.startLevel(); // Esto pone el estado en RUNNING
                this.audioController.playMusic(0);
                break;

            case "MENU":
                // CORRECCIÓN:
                // No llamamos a this.resetGame() porque eso inicia el juego.
                // Solo cambiamos el estado y limpiamos objetos visualmente.
                
                this.gameState.set(GAMESTATE.MENU);
                
                // Reseteamos objetos para que estén listos, pero SIN iniciar el nivel
                this.balls = [new Ball(this.gameWidth, this.gameHeight)];
                this.paddle.reset();
                this.powerUps = [];
                this.activeEffects = [];
                
                this.audioController.playMusic(0); 
                break;
        }
    }

    update(deltaTime) {
        if (this.gameState.current !== GAMESTATE.RUNNING) return;

        this.paddle.update(deltaTime);
        
        this.balls.forEach(ball => ball.update(deltaTime, this.paddle));
        this.balls = this.balls.filter(ball => ball.position.y <= this.gameHeight);

        this.level.update(deltaTime);
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);
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
            this.level = new Level(this.gameWidth, this.gameHeight);
            this.powerUps = []; 

            this.balls.forEach(ball => {
            ball.speed.x *= 1.3;
            ball.speed.y *= 1.3;
            });
        }
        

        if (this.balls.length === 0) {
            this.triggerShake(20);
            const isDead = this.player.loseLife();
            
            if (this.player.lives <= 0) {
                this.audioController.play('lose');
                this.gameState.set(GAMESTATE.GAMEOVER);
                this.gameOverView.resetSelection();
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

        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.position.x, p.position.y, p.size, p.size);
        });
        this.ctx.globalAlpha = 1.0;

        if (this.gameState.current === GAMESTATE.MENU) {
            this.mainMenuView.draw(this.ctx);
            this.renderer.drawCRT();
        } 
        else if (this.gameState.current === GAMESTATE.OPTIONS) {
            this.optionsView.draw(this.ctx, this.musicVolume, this.sfxVolume, this.inputMode); 
            this.renderer.drawCRT();
        }
        else if (this.gameState.current === GAMESTATE.RUNNING || this.gameState.current === GAMESTATE.PAUSED) {
            this.renderer.draw([...this.balls, this.paddle, ...this.level.bricks, ...this.powerUps]);
            
            const darkness = this.activeEffects.find(e => e.type === POWERUP_TYPES.DARKNESS);
            if (darkness) {
                this.renderer.drawDarkness(this.paddle, this.balls);
            }

            this.hud.draw(this.ctx, this.player, this.activeEffects || [], this.currentLevelNum);

            this.renderer.drawCRT();

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

            this.renderer.drawCRT();

            this.gameOverView.draw(this.ctx, this.player.score, this.currentLevelNum);
        }
    }
}