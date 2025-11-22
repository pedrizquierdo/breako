export default class OptionsView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        this.options = [
            { label: "MÚSICA", type: "music" },
            { label: "EFECTOS", type: "sfx" },
            { label: "CONTROLES", type: "input" }, // <--- NUEVA OPCIÓN
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

    // Recibimos inputMode para dibujarlo
    draw(ctx, musicVol, sfxVol, inputMode) {
        // Fondo negro
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        ctx.font = "bold 40px 'Courier New'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("CONFIGURACIÓN", this.gameWidth / 2, 100);

        ctx.font = "24px 'Courier New'";
        
        this.options.forEach((opt, index) => {
            const isSelected = index === this.selectedIndex;
            const color = isSelected ? "#FFFFFF" : "#555555";
            const yPos = 250 + (index * 70); // Ajusté un poco el espaciado

            ctx.fillStyle = color;
            
            // TÍTULO DE LA OPCIÓN
            let prefix = isSelected ? "> " : "";
            
            if (opt.type === 'back') {
                 let text = isSelected ? `[ ${opt.label} ]` : opt.label;
                 ctx.fillText(text, this.gameWidth / 2, yPos);
            } else {
                ctx.fillText(prefix + opt.label, this.gameWidth / 2, yPos);
                
                // VALOR DE LA OPCIÓN (Debajo)
                let valueY = yPos + 25;
                
                if (opt.type === 'music' || opt.type === 'sfx') {
                    // Barras de volumen
                    let currentVol = opt.type === 'music' ? musicVol : sfxVol;
                    let bars = Math.round(currentVol * 10);
                    let barWidth = 20;
                    let barHeight = 15;
                    let startX = (this.gameWidth / 2) - (10 * barWidth) / 2;

                    for(let i = 0; i < 10; i++) {
                        if (i < bars) {
                            ctx.fillStyle = isSelected ? "white" : "#888";
                            ctx.fillRect(startX + (i * 22), valueY, barWidth, barHeight);
                        } else {
                            ctx.strokeStyle = "#333";
                            ctx.strokeRect(startX + (i * 22), valueY, barWidth, barHeight);
                        }
                    }
                } 
                // --- DIBUJAR SELECTOR DE INPUT ---
                else if (opt.type === 'input') {
                    ctx.fillStyle = isSelected ? "#fa0" : "#888"; // Naranja si seleccionado
                    let text = inputMode === 'MOUSE' ? "< MOUSE >" : "< TECLADO >";
                    ctx.fillText(text, this.gameWidth / 2, valueY + 5);
                }
            }
        });

        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#888";
        ctx.fillText("IZQ/DER: Ajustar | ESPACIO: Aceptar", this.gameWidth / 2, this.gameHeight - 50);
    }
}