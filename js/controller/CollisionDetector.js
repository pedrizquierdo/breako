import { POWERUP_TYPES } from '../model/PowerUp.js';

export default class CollisionDetector {

    // Método auxiliar para detectar colisión AABB
    checkCollision(obj1, obj2) {
        const width1 = obj1.width || obj1.size;
        const height1 = obj1.height || obj1.size;
        const width2 = obj2.width || obj2.size;
        const height2 = obj2.height || obj2.size;

        if (
            obj1.position.x < obj2.position.x + width2 &&
            obj1.position.x + width1 > obj2.position.x &&
            obj1.position.y < obj2.position.y + height2 &&
            obj1.position.y + height1 > obj2.position.y
        ) {
            return true;
        }
        return false;
    }

    // Método para resolver colisiones físicas (Anti-Tunneling)
    resolveCollision(ball, gameObject) {
        const overlapLeft = (ball.position.x + ball.size) - gameObject.position.x;
        const overlapRight = (gameObject.position.x + gameObject.width) - ball.position.x;
        const overlapTop = (ball.position.y + ball.size) - gameObject.position.y;
        const overlapBottom = (gameObject.position.y + gameObject.height) - ball.position.y;

        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (minOverlap === overlapTop) {
            ball.speed.y = -Math.abs(ball.speed.y);
            ball.position.y = gameObject.position.y - ball.size;
        } 
        else if (minOverlap === overlapBottom) {
            ball.speed.y = Math.abs(ball.speed.y);
            ball.position.y = gameObject.position.y + gameObject.height;
        } 
        else if (minOverlap === overlapLeft) {
            ball.speed.x = -Math.abs(ball.speed.x);
            ball.position.x = gameObject.position.x - ball.size;
        } 
        else if (minOverlap === overlapRight) {
            ball.speed.x = Math.abs(ball.speed.x);
            ball.position.x = gameObject.position.x + gameObject.width;
        }
    }

    // AHORA RECIBE 'balls' (Array) en vez de 'ball'
    detect(balls, paddle, level, audioController, gameController) {
        
        // Verificar Flags Globales
        const rainActive = gameController.activeEffects.some(e => e.type === POWERUP_TYPES.LOOT_RAIN);
        const armorActive = gameController.activeEffects.some(e => e.type === POWERUP_TYPES.ARMORED_BRICKS);

        // [ Diagrama de Flujo: Iterar Bolas -> Checar Colisiones -> Resolver ]
        balls.forEach(ball => {
            
            // 1. Bola - Paddle
            if (this.checkCollision(ball, paddle)) {
                 let collidePoint = ball.position.x - (paddle.position.x + paddle.width / 2);
                 collidePoint = collidePoint / (paddle.width / 2);
                 let angle = collidePoint * (Math.PI / 3);
                 
                 let speed = Math.sqrt(ball.speed.x * ball.speed.x + ball.speed.y * ball.speed.y);
                 ball.speed.x = speed * Math.sin(angle);
                 ball.speed.y = -speed * Math.cos(angle);
                 ball.position.y = paddle.position.y - ball.size;
                 audioController.play('hit');
            }

            // 2. Bola - Ladrillos
            for (let i = level.bricks.length - 1; i >= 0; i--) {
                const brick = level.bricks[i];
                
                if (this.checkCollision(ball, brick)) {
                    this.resolveCollision(ball, brick);
                    
                    // Lógica: ARMADURA (50% chance de no romper)
                    if (armorActive && Math.random() > 0.5) {
                        audioController.play('hit'); 
                        break; 
                    }

                    const destroyed = brick.hit();
                    audioController.play('hit');
                    
                    // Lógica: BOLA EXPLOSIVA
                    if (ball.isExplosive) {
                        level.bricks.forEach(otherBrick => {
                            const dx = brick.position.x - otherBrick.position.x;
                            const dy = brick.position.y - otherBrick.position.y;
                            const dist = Math.sqrt(dx*dx + dy*dy);
                            if (dist < 100 && dist > 0) {
                                otherBrick.markedForDeletion = true; 
                            }
                        });
                    }

                    if (destroyed || ball.isExplosive) { 
                        gameController.player.addScore(10);
                        
                        // Lógica: LLUVIA
                        const dropRate = rainActive ? 0.8 : 0.15;
                        if (Math.random() < dropRate) {
                            gameController.spawnPowerUp(brick.position);
                        }
                    }
                    break; 
                }
            }
        });

        // 3. Paddle - PowerUps
        gameController.powerUps.forEach(powerUp => {
            if (this.checkCollision(powerUp, paddle)) {
                 gameController.activatePowerUp(powerUp);
                 powerUp.markedForDeletion = true;
            }
        });
    }
}