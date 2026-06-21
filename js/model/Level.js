import Brick from './Brick.js';
import { LEVEL_PATTERNS } from '../data/levels.js';

const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 24;
const BRICK_Y_OFFSET = 50;
const MAX_SCALED_ROWS = 8;
const SCALED_COLS = 10;
const INDESTRUCTIBLE_START_LEVEL = LEVEL_PATTERNS.length + 5;

export default class Level {
    constructor(gameWidth, gameHeight, currentLevelNum = 1) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.bricks = [];

        if (currentLevelNum <= LEVEL_PATTERNS.length) {
            this.buildFromPattern(LEVEL_PATTERNS[currentLevelNum - 1]);
        } else {
            this.buildScaledRandomLevel(currentLevelNum);
        }
    }

    // Generador aleatorio original. Se mantiene como utilidad/fallback interno.
    buildRandomLevel() {
        this.bricks = [];
        const rows = 5;
        const cols = 10;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() < 0.7) {
                    let position = {
                        x: c * 80,
                        y: r * 24 + 50
                    };
                    this.bricks.push(new Brick(position));
                }
            }
        }
    }

    // Construye el nivel a partir de una matriz 2D definida a mano
    buildFromPattern(pattern) {
        this.bricks = [];

        pattern.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell === 0) return;

                const position = {
                    x: c * BRICK_WIDTH,
                    y: r * BRICK_HEIGHT + BRICK_Y_OFFSET
                };

                const resistencia = cell === 3 ? Infinity : cell;
                this.bricks.push(new Brick(position, resistencia));
            });
        });
    }

    // Generación procedural escalada para niveles más allá de los patrones diseñados a mano
    buildScaledRandomLevel(currentLevelNum) {
        this.bricks = [];

        const extraLevels = currentLevelNum - LEVEL_PATTERNS.length;
        const rows = Math.min(MAX_SCALED_ROWS, 5 + Math.floor(extraLevels / 2));

        const reinforcedChance = Math.min(0.6, 0.2 + extraLevels * 0.02);
        const indestructibleChance = currentLevelNum >= INDESTRUCTIBLE_START_LEVEL
            ? Math.min(0.15, (currentLevelNum - INDESTRUCTIBLE_START_LEVEL) * 0.01 + 0.02)
            : 0;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < SCALED_COLS; c++) {
                if (Math.random() < 0.7) {
                    const position = {
                        x: c * BRICK_WIDTH,
                        y: r * BRICK_HEIGHT + BRICK_Y_OFFSET
                    };

                    let resistencia = 1;
                    if (indestructibleChance > 0 && Math.random() < indestructibleChance) {
                        resistencia = Infinity;
                    } else if (Math.random() < reinforcedChance) {
                        resistencia = 2;
                    }

                    this.bricks.push(new Brick(position, resistencia));
                }
            }
        }
    }

    // --- NUEVO MÉTODO PARA CARGAR LADRILLOS GUARDADOS ---
    loadFromSave(savedBricksData) {
        this.bricks = []; // Limpiamos el nivel generado por defecto

        savedBricksData.forEach(data => {
            // JSON no soporta Infinity, por eso se guarda como el sentinela 'INF'
            const resistencia = data.resistencia === 'INF' ? Infinity : data.resistencia;
            const brick = new Brick({ x: data.x, y: data.y }, resistencia);
            this.bricks.push(brick);
        });
    }

    update(deltaTime) {
        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }
}