export default class Renderer {
    constructor(ctx, width, height, spriteManager) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.spriteManager = spriteManager;
        this.shakeIntensity = 0;
    }

    shake(intensity) {
        this.shakeIntensity = intensity;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    draw(gameObjects) {

        this.ctx.save(); // Guardamos estado original

        // --- LÓGICA DE TEMBLOR ---
        if (this.shakeIntensity > 0) {
            const dx = (Math.random() - 0.5) * this.shakeIntensity;
            const dy = (Math.random() - 0.5) * this.shakeIntensity;
            this.ctx.translate(dx, dy);
            
            // Reducimos el temblor poco a poco (decay)
            this.shakeIntensity *= 0.9;
            if (this.shakeIntensity < 0.5) this.shakeIntensity = 0;
        }

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
        this.ctx.restore(); // Restauramos estado original
    }
    

    drawCRT() {
        this.ctx.save();
        
        // 1. SCANLINES (Líneas horizontales)
        // Bajé un poco la opacidad de las líneas también (0.3 -> 0.2) para limpiar la imagen
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; 
        for (let i = 0; i < this.height; i += 4) {
            this.ctx.fillRect(0, i, this.width, 2);
        }

        // 2. VIGNETTE (Esquinas oscuras)
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, this.height / 2.5, 
            this.width / 2, this.height / 2, this.height
        );
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.9, "rgba(0, 0, 0, 0.1)"); // Más suave
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");   // Más suave

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 3. FLICKER (Parpadeo) - AJUSTADO AQUÍ
        // Antes: 0.03 (3% de opacidad máxima)
        // Ahora: 0.01 (1% de opacidad máxima) -> Mucho más tenue
        const opacity = Math.random() * 0.01; 
        
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        
        // Usamos 'screen' para que solo ilumine y no "lave" los negros
        this.ctx.globalCompositeOperation = 'screen'; 
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore();
    }

    drawDarkness() {
        this.ctx.save();
        
        // EFECTO: LUZ ROTA / ESTROBOSCÓPICA
        
        // Obtenemos el tiempo actual para crear patrones
        const time = Date.now();

        // Lógica:
        // 1. Oscilación lenta (Math.sin): Simula que la luz va y viene.
        // 2. Ruido aleatorio (Math.random): Simula el fallo eléctrico repentino.
        
        const sineWave = Math.sin(time * 0.01); // Onda suave
        
        // Si la onda está en su punto bajo O si el random decide "apagar" la luz (30% chance)
        if (sineWave < -0.5 || Math.random() < 0.3) {
            // PANTALLA NEGRA TOTAL (Luz apagada)
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, this.width, this.height);
        } 
        else {
            // LUZ TENUE / PARPADEANTE
            // Incluso cuando está "encendida", le ponemos una capa oscura variable
            // para que cueste ver un poco.
            const darknessLevel = 0.3 + (Math.random() * 0.4); // Entre 30% y 70% de oscuridad
            this.ctx.fillStyle = `rgba(0, 0, 0, ${darknessLevel})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        this.ctx.restore();
    }
}