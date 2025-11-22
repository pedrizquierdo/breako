export default class Paddle {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.defaultWidth = 150;
        this.width = this.defaultWidth;
        this.height = 20;
        
        this.maxSpeed = 7;
        this.speed = 0;
        
        // NUEVO: Banderas de estado de teclas
        this.movingLeft = false;
        this.movingRight = false;
        
        this.invertedControls = false;
        
        this.reset();
    }

    reset() {
        this.width = this.defaultWidth;
        this.invertedControls = false;
        this.movingLeft = false;
        this.movingRight = false;
        this.speed = 0;
        this.position = {
            x: this.gameWidth / 2 - this.width / 2,
            y: this.gameHeight - this.height - 10,
        };
    }

    // --- NUEVOS MÉTODOS DE CONTROL ---
    // Ya no movemos directamente, solo avisamos la intención
    pressLeft() { this.movingLeft = true; }
    releaseLeft() { this.movingLeft = false; }

    pressRight() { this.movingRight = true; }
    releaseRight() { this.movingRight = false; }

    // Parada total (para Game Over o reinicios)
    stop() {
        this.movingLeft = false;
        this.movingRight = false;
        this.speed = 0;
    }

    update(deltaTime) {
        // Lógica de movimiento fluida
        // Si presionas ambas teclas a la vez, se queda quieto
        
        if (this.movingLeft && !this.movingRight) {
            // Si vamos a la izquierda...
            this.speed = this.invertedControls ? this.maxSpeed : -this.maxSpeed;
        } 
        else if (this.movingRight && !this.movingLeft) {
            // Si vamos a la derecha...
            this.speed = this.invertedControls ? -this.maxSpeed : this.maxSpeed;
        } 
        else {
            // Si no tocas nada O tocas ambas
            this.speed = 0;
        }

        this.position.x += this.speed;

        // Límites de pantalla
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > this.gameWidth) {
            this.position.x = this.gameWidth - this.width;
        }
    }
}