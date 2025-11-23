export default class OptionsView {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        
        // ASEGÚRATE QUE ESTE ARRAY TENGA LAS 5 OPCIONES
        this.options = [
            { label: "MÚSICA", type: "music" },
            { label: "EFECTOS", type: "sfx" },
            { label: "CONTROLES", type: "input" },
            { label: "DIFICULTAD", type: "diff" }, 
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

    // AÑADIMOS 'difficultyMode' A LOS ARGUMENTOS
    draw(ctx, musicVol, sfxVol, inputMode, difficultyMode) {
        // 1. Fondo
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);

        // 2. Título
        ctx.font = "bold 40px 'Courier New'";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("CONFIGURACIÓN", this.gameWidth / 2, 80);

        ctx.font = "24px 'Courier New'";
        
        // 3. Dibujar cada opción
        this.options.forEach((opt, index) => {
            const isSelected = index === this.selectedIndex;
            const color = isSelected ? "#FFFFFF" : "#555555";
            
            // Calculamos posición Y (Separación de 85px para que quepa todo bien)
            const yPos = 180 + (index * 85);
            const valueY = yPos + 30;

            ctx.fillStyle = color;
            
            // --- TÍTULO DE LA OPCIÓN ---
            let label = opt.label;
            if (isSelected) label = `> ${label}`; // Flecha si está seleccionado
            
            // Si es el botón VOLVER, lo dibujamos diferente y terminamos esta iteración
            if (opt.type === 'back') {
                if (isSelected) label = `[ ${opt.label} ]`;
                ctx.fillText(label, this.gameWidth / 2, yPos + 20); // Un poco más abajo
                return; // Continuar al siguiente (aunque es el último)
            }

            // Dibujamos el nombre de la opción (MÚSICA, EFECTOS, ETC)
            ctx.fillText(label, this.gameWidth / 2, yPos);

            // --- VALORES DE LA OPCIÓN ---
            
            // A. BARRAS DE VOLUMEN
            if (opt.type === 'music' || opt.type === 'sfx') {
                let currentVol = opt.type === 'music' ? musicVol : sfxVol;
                // Protección contra undefined
                if (currentVol === undefined) currentVol = 0.5;

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
                        ctx.lineWidth = 2;
                        ctx.strokeRect(startX + (i * 22), valueY, barWidth, barHeight);
                    }
                }
            }
            
            // B. CONTROLES (INPUT)
            else if (opt.type === 'input') {
                ctx.fillStyle = isSelected ? "#fa0" : "#888";
                let text = inputMode === 'MOUSE' ? "< MOUSE >" : "< TECLADO >";
                ctx.fillText(text, this.gameWidth / 2, valueY);
            }
            
            // C. DIFICULTAD (DIFF) - AQUÍ FALLABA ANTES
            else if (opt.type === 'diff') {
                ctx.fillStyle = isSelected ? "#fa0" : "#888";
                
                // Protección: Si difficultyMode no llega, usamos 'NORMAL'
                let safeMode = difficultyMode || 'NORMAL';
                
                let text = safeMode === 'DYNAMIC' ? "< DINÁMICA >" : "< NORMAL >";
                ctx.fillText(text, this.gameWidth / 2, valueY);

                // Subtítulo pequeño
                ctx.font = "14px 'Courier New'";
                ctx.fillStyle = "#666";
                let desc = safeMode === 'DYNAMIC' ? "(Aceleración Progresiva)" : "(Velocidad Constante)";
                ctx.fillText(desc, this.gameWidth / 2, valueY + 25);
                ctx.font = "24px 'Courier New'"; // Restaurar fuente grande
            }
        });

        // 4. Footer
        ctx.font = "14px 'Courier New'";
        ctx.fillStyle = "#888";
        ctx.fillText("IZQ/DER: Ajustar | ESPACIO: Aceptar", this.gameWidth / 2, this.gameHeight - 30);
    }
}