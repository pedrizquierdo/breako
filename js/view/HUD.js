export default class HUD {
    constructor(gameWidth, gameHeight, spriteManager) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.spriteManager = spriteManager;
    }

    draw(ctx, player, activeEffects, levelNumber) {
        ctx.fillStyle = "white";
        ctx.font = "bold 20px 'Courier New'";
        
        // --- HEADER (Parte Superior - Mantenemos info vital) ---
        // Nivel
        ctx.textAlign = "left";
        ctx.fillText(`LVL ${levelNumber}`, 20, 30);

        // Puntuación
        ctx.textAlign = "center";
        ctx.fillText(`${player.score}`, this.gameWidth / 2, 30);

        // Vidas
        ctx.textAlign = "right";
        let hearts = "♥".repeat(player.lives);
        ctx.fillText(hearts, this.gameWidth - 20, 30);

        // Escudo (Arriba a la derecha, debajo de vidas)
        if (player.activeShield) {
            ctx.font = "bold 16px 'Courier New'";
            ctx.fillText("[ ESCUDO ACTIVO ]", this.gameWidth - 20, 55);
        }

        // --- FOOTER (Parte Inferior - PowerUps Activos) ---
        // Empezamos desde abajo y vamos subiendo
        let yPos = this.gameHeight - 40; 
        const barWidth = 100;
        const barHeight = 8; // Un poco más finas para que sea elegante
        const iconSize = 20;

        activeEffects.forEach(effect => {
            let maxDuration = effect.totalDuration || 10000;
            let pct = Math.max(0, effect.timeLeft / maxDuration);

            // 1. DIBUJAR ICONO (Izquierda Abajo)
            const sprite = this.spriteManager.get(effect.type);
            
            if (sprite) {
                // Icono
                ctx.drawImage(sprite, 20, yPos - 14, iconSize, iconSize);
            } else {
                // Fallback Texto
                ctx.textAlign = "left";
                ctx.font = "12px 'Courier New'";
                ctx.fillStyle = "white";
                ctx.fillText(effect.type.charAt(0), 20, yPos);
            }

            // 2. DIBUJAR BARRA (Al lado del icono)
            const barX = 50; 

            // Fondo de la barra (Gris oscuro para ver cuánto falta)
            ctx.fillStyle = "#333";
            ctx.fillRect(barX, yPos - 8, barWidth, barHeight);

            // Borde
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, yPos - 8, barWidth, barHeight);

            // Relleno (Blanco)
            ctx.fillStyle = "white";
            ctx.fillRect(barX, yPos - 8, barWidth * pct, barHeight);

            // Etiqueta de texto pequeña encima de la barra (opcional, ayuda a identificar)
            // ctx.font = "10px 'Courier New'";
            // ctx.fillText(effect.type, barX, yPos - 12);

            // SUBIMOS la posición Y para el siguiente efecto (Stack Up)
            yPos -= 30; 
        });
    }
}