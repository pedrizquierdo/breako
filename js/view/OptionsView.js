export default class OptionsView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.options = [
            { label: "MÚSICA", type: "music" },
            { label: "EFECTOS", type: "sfx" },
            { label: "VOLVER", type: "back" }
        ];
        this.selectedIndex = 0;
    }

    moveUp() {
        this.selectedIndex--;
        if (this.selectedIndex < 0) this.selectedIndex = this.options.length - 1;
    }

    moveDown() {
        this.selectedIndex++;
        if (this.selectedIndex >= this.options.length) this.selectedIndex = 0;
    }

    getCurrentOption() {
        return this.options[this.selectedIndex];
    }

    draw(ctx, musicVol, sfxVol) {
        // Fondo negro
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        ctx.font = "bold 40px 'Courier New'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("CONFIGURACIÓN", this.gameWidth / 2, 100);

        ctx.font = "24px 'Courier New'";
        
        this.options.forEach((opt, index) => {
            // Blanco si está seleccionado, Gris si no
            const isSelected = index === this.selectedIndex;
            const color = isSelected ? "#FFFFFF" : "#555555";
            const yPos = 250 + (index * 90);

            ctx.fillStyle = color;
            
            if (opt.type === 'music' || opt.type === 'sfx') {
                // Dibujar Etiqueta
                let prefix = isSelected ? "> " : "";
                ctx.fillText(prefix + opt.label, this.gameWidth / 2, yPos);

                // Dibujar Barra de Volumen Retro [■■■■■-----]
                let currentVol = opt.type === 'music' ? musicVol : sfxVol;
                let bars = Math.round(currentVol * 10); 
                
                // Dibujar los bloques manualmente para que se vean mejor
                let barWidth = 20;
                let barHeight = 20;
                let startX = (this.gameWidth / 2) - (10 * barWidth) / 2;

                for(let i = 0; i < 10; i++) {
                    if (i < bars) {
                        ctx.fillStyle = isSelected ? "white" : "#888"; // Lleno
                        ctx.fillRect(startX + (i * 22), yPos + 20, barWidth, barHeight);
                    } else {
                        ctx.strokeStyle = "#333"; // Vacío (solo borde)
                        ctx.lineWidth = 2;
                        ctx.strokeRect(startX + (i * 22), yPos + 20, barWidth, barHeight);
                    }
                }

            } else {
                // Botón Volver
                let text = isSelected ? `[ ${opt.label} ]` : opt.label;
                ctx.fillText(text, this.gameWidth / 2, yPos);
            }
        });

        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#888";
        ctx.fillText("IZQ/DER: Ajustar | ESPACIO: Aceptar", this.gameWidth / 2, this.gameHeight - 50);
    }
}