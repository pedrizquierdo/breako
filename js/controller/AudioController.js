export default class AudioController {
    constructor() {
        // Efectos de Sonido (SFX)
        this.sounds = {
            hit: new Audio('assets/sounds/mus_drumkick.wav'),
            win: new Audio('assets/sounds/snd_dumbvictory.wav'),
            lose: new Audio('assets/sounds/mus_f_endnote.wav'),
            powerup: new Audio('assets/sounds/snd_heal_c.wav'),
            bottomHit: new Audio('assets/sounds/snd_hurt1_c.wav'),
        };

        // Música de Fondo (BGM)
        // Asumimos nombres genéricos, asegúrate de tener estos archivos o cambia los nombres
        this.musicTracks = [
            new Audio('assets/sounds/game soundtrack.mp3'),
            new Audio('assets/sounds/audio.mp3')
        ];
        this.currentMusic = null;

        // Configuración inicial de volumen
        this.sounds.hit.volume = 0.5;
        this.sounds.bottomHit.volume = 0.6;
        this.sounds.powerup.volume = 0.6;
        
        // Configurar música para que se repita (loop)
        this.musicTracks.forEach(track => {
            track.loop = true;
            track.volume = 0.3; // Música más baja que los efectos
        });
    }

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Reiniciar para sonidos rápidos
            // Usamos catch para evitar errores si el usuario no ha interactuado aún con la página
            sound.play().catch(e => console.warn(`No se pudo reproducir ${soundName}:`, e));
        }
    }

    playMusic(trackIndex = 0) {
        // Detener música actual si existe
        this.stopMusic();

        // Seleccionar track (si index es mayor al array, usa el 0)
        const track = this.musicTracks[trackIndex] || this.musicTracks[0];
        this.currentMusic = track;
        
        this.currentMusic.play().catch(e => console.warn("Esperando interacción usuario para música"));
    }

    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
    }

    // Agrega esto dentro de AudioController
    setMusicVolume(volume) {
        // Asegurar que esté entre 0 y 1
        volume = Math.max(0, Math.min(1, volume));
        this.musicTracks.forEach(track => {
            track.volume = volume;
        });
    }

    setSFXVolume(volume) {
        // Asegurar que esté entre 0 y 1
        volume = Math.max(0, Math.min(1, volume));
        // Recorrer el objeto de sonidos
        Object.values(this.sounds).forEach(sound => {
            sound.volume = volume;
        });
    } 
}