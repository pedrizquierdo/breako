export default class Brick {
    constructor(position) {
        this.position = position;
        this.width = 80;
        this.height = 24;
        this.markedForDeletion = false;
        
        // [PDF Pág 5] Atributo: resistencia
        // 20% de probabilidad de ser un ladrillo reforzado (2 golpes), si no, 1 golpe.
        this.resistencia = Math.random() > 0.8 ? 2 : 1; 
    }

    hit() {
        this.resistencia--;
        if (this.resistencia <= 0) {
            this.markedForDeletion = true;
            return true; // Devuelve true si se destruyó
        }
        return false; // Devuelve false si solo se agrietó
    }
}