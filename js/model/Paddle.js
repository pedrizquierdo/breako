export default class Paddle {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // DIMENSIONES DEL SPRITE
        this.defaultWidth = 150; // Ancho base
        this.width = this.defaultWidth;
        this.height = 21;        // Alto base
        
        this.maxSpeed = 7;
        this.speed = 0;
        
        this.invertedControls = false;
        
        this.reset();
    }

    reset() {
        this.width = this.defaultWidth;
        this.invertedControls = false;
        this.speed = 0;
        this.position = {
            x: this.gameWidth / 2 - this.width / 2,
            // Ajustamos la Y para que no quede pegado al borde inferior absoluto
            y: this.gameHeight - this.height - 10,
        };
    }

    moveLeft() {
        if (this.invertedControls) {
            this.speed = this.maxSpeed;
        } else {
            this.speed = -this.maxSpeed;
        }
    }

    moveRight() {
        if (this.invertedControls) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = this.maxSpeed;
        }
    }

    stop() {
        this.speed = 0;
    }

    update(deltaTime) {
        this.position.x += this.speed;

        // Límites de pantalla
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > this.gameWidth) {
            this.position.x = this.gameWidth - this.width;
        }
    }
}