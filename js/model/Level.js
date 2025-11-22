import Brick from './Brick.js';

export default class Level {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.bricks = [];
        
        
        this.buildRandomLevel();
    }

    buildRandomLevel() {
        this.bricks = []; 

        const rows = 5;
        const cols = 10; 
        const padding = 0; 

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

    update(deltaTime) {
        // Filtrar ladrillos destruidos
        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }
}