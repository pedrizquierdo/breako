export default class Renderer {
    constructor(ctx, width, height, spriteManager) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.spriteManager = spriteManager;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw(gameObjects) {
        gameObjects.forEach(object => {
            const name = object.constructor.name;

            // --- BOLA (32x32) ---
            if(name === 'Ball') {
                const sprite = this.spriteManager.get('ball');
                if (sprite) {
                    this.ctx.drawImage(sprite, object.position.x, object.position.y, object.size, object.size);
                } else {
                    // Fallback
                    this.ctx.fillStyle = '#FFFFFF'; 
                    this.ctx.beginPath();
                    const radius = object.size / 2;
                    this.ctx.arc(object.position.x + radius, object.position.y + radius, radius, 0, Math.PI*2);
                    this.ctx.fill();
                }

            // --- PADDLE (128x32) ---
            } else if (name === 'Paddle') {
                const sprite = this.spriteManager.get('paddle');
                if (sprite) {
                    this.ctx.drawImage(sprite, object.position.x, object.position.y, object.width, object.height);
                } else {
                    // Fallback
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillRect(object.position.x, object.position.y, object.width, object.height);
                }

            // --- LADRILLOS (Estilo Noir con Código) ---
            } else if (name === 'Brick') {
                if (object.resistencia > 1) {
                    // Reforzado: Gris oscuro con borde blanco grueso
                    this.ctx.fillStyle = '#444'; 
                    this.ctx.fillRect(object.position.x, object.position.y, object.width, object.height);
                    this.ctx.strokeStyle = '#fff';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(object.position.x + 1, object.position.y + 1, object.width - 2, object.height - 2);
                } else {
                    // Normal: Blanco con borde negro fino
                    this.ctx.fillStyle = '#fff'; 
                    this.ctx.fillRect(object.position.x, object.position.y, object.width, object.height);
                    this.ctx.strokeStyle = '#000';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(object.position.x, object.position.y, object.width, object.height);
                }

            // --- POWER UPS ---
            } else if (name === 'PowerUp') {
                // Buscamos el sprite usando el TIPO (ej. 'MEGA', 'BOOM')
                const sprite = this.spriteManager.get(object.type);

                if (sprite) {
                    // DIBUJAR SPRITE
                    this.ctx.drawImage(sprite, object.position.x, object.position.y, object.width, object.height);
                } else {
                    // FALLBACK (Si falta la imagen, dibuja cajita con letra)
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillRect(object.position.x, object.position.y, object.width, object.height);
                    
                    this.ctx.fillStyle = '#000000';
                    this.ctx.font = "bold 12px Courier";
                    this.ctx.textAlign = "center";
                    const letter = object.type ? object.type.charAt(0) : '?';
                    this.ctx.fillText(letter, object.position.x + object.width/2, object.position.y + 20);
                }
            }
        });
    }

    drawDarkness(paddle, balls) {
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        this.ctx.globalCompositeOperation = 'destination-out';
        
        // Luz Paddle
        this.ctx.beginPath();
        this.ctx.arc(paddle.position.x + paddle.width/2, paddle.position.y + paddle.height/2, 150, 0, Math.PI*2);
        this.ctx.fill();

        // Luz Bolas
        balls.forEach(ball => {
            this.ctx.beginPath();
            this.ctx.arc(ball.position.x + ball.size/2, ball.position.y + ball.size/2, 100, 0, Math.PI*2);
            this.ctx.fill();
        });

        this.ctx.restore();
    }
}