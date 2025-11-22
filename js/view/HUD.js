export default class HUD {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    draw(ctx, player, activeEffects, levelNumber) {
        // 1. FONDO TRANSPARENTE:
        // Eliminamos el ctx.fillRect y la línea divisoria para que sea limpio.

        ctx.fillStyle = "white";
        ctx.font = "bold 20px 'Courier New'";
        
        // --- NIVEL (Izquierda) ---
        ctx.textAlign = "left";
        ctx.fillText(`LVL ${levelNumber}`, 20, 30);

        // --- PUNTUACIÓN (Centro - Opcional) ---
        ctx.textAlign = "center";
        ctx.fillText(`${player.score}`, this.gameWidth / 2, 30);

        // --- VIDAS (Derecha) ---
        ctx.textAlign = "right";
        // Dibujamos corazones o bloques simples
        let hearts = "♥".repeat(player.lives);
        ctx.fillText(hearts, this.gameWidth - 20, 30);


        // 2. INDICADOR DE ESCUDO (ARREGLADO)
        // Lo movemos arriba a la derecha (debajo de vidas) para que NO TAPE el paddle.
        if (player.activeShield) {
            ctx.textAlign = "right";
            ctx.font = "bold 16px 'Courier New'";
            ctx.fillText("[ ESCUDO ACTIVO ]", this.gameWidth - 20, 55);
        }


        // 3. POWER-UPS COMO BARRAS DE PROGRESO
        let yOffset = 60; // Empezamos a dibujar debajo del texto superior
        const barWidth = 100;
        const barHeight = 10;

        activeEffects.forEach(effect => {
            // Definimos la duración máxima para calcular el porcentaje
            // (Debes asegurarte que coincida con lo que pusiste en PowerUp.js)
            let maxDuration = 0;
            if (effect.type === 'EXPLOSIVE') maxDuration = 8000;
            if (effect.type === 'FRENZY') maxDuration = 12000;

            // Calcular porcentaje restante (0.0 a 1.0)
            let pct = Math.max(0, effect.timeLeft / maxDuration);

            // Dibujar etiqueta del efecto
            ctx.textAlign = "left";
            ctx.font = "14px 'Courier New'";
            ctx.fillStyle = "white";
            ctx.fillText(effect.type, 20, yOffset);

            // Dibujar Contenedor de la barra (borde blanco)
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeRect(100, yOffset - 10, barWidth, barHeight);

            // Dibujar Relleno de la barra (blanco sólido que se encoge)
            ctx.fillStyle = "white";
            ctx.fillRect(100, yOffset - 10, barWidth * pct, barHeight);

            yOffset += 25; // Espacio para el siguiente efecto
        });
    }
}