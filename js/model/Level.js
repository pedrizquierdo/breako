import Brick from './Brick.js';

export default class Level {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.bricks = [];
        
        // Por defecto crea uno aleatorio, pero si cargamos partida
        // sobrescribiremos esto inmediatamente.
        this.buildRandomLevel();
    }

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

    // --- NUEVO MÉTODO PARA CARGAR LADRILLOS GUARDADOS ---
    loadFromSave(savedBricksData) {
        this.bricks = []; // Limpiamos el nivel aleatorio generado por defecto
        
        savedBricksData.forEach(data => {
            // Creamos el ladrillo en su posición original
            const brick = new Brick({ x: data.x, y: data.y });
            
            // Restauramos su resistencia específica (para que no se regenere aleatoria)
            brick.resistencia = data.resistencia;
            
            this.bricks.push(brick);
        });
    }
    
    update(deltaTime) {
        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion);
    }
}