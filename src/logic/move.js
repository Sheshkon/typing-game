import {COLLISION_ATTACK} from '@/constants.js';
import {useGameStore} from '@/stores/game.js';
import {Animation} from '@/types/animation.js';

export class MoveController {
    constructor() {
        this.gameStore = useGameStore();
    }

    update() {
        this.#lookAtNearestEnemy();
        this.#moveEnemies();
        this.#moveProjectiles();
        this.#removeDeadEntities();
    }

    #moveProjectiles() {
        const {projectiles, enemies, stats, levelConfig} = this.gameStore;
        projectiles.forEach(s => {
            s.x += s.vx;
            s.y += s.vy;

            const hitEnemy = enemies.find(e => !e.isDyingOrDead && e.id === s.targetId);
            if (hitEnemy) {
                const dx = hitEnemy.x - s.x;
                const dy = hitEnemy.y - s.y;
                if (Math.sqrt(dx * dx + dy * dy) < COLLISION_ATTACK) {
                    s.isDead = true;
                    hitEnemy.hurt();
                    stats.score += levelConfig.scoresPerAction;
                    this.gameStore.leftActiveAim();
                }
            }
        });
    }

    #removeDeadEntities() {
        const {enemies, projectiles} = this.gameStore;
        this.gameStore.enemies = enemies.filter(e => !e.isDead);
        if (!enemies.length) this.gameStore.projectiles = [];
        this.gameStore.projectiles = projectiles.filter(s => !s.isDead);
    }

    #moveEnemies() {
        const {player, stats, enemies} = this.gameStore;
        enemies
            .filter(e => !e.isDyingOrDead && !e.isAttacking)
            .forEach(e => {
                const dx = player.x - e.x;
                const dy = player.y - e.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                e.x += (dx / dist) * e.speed;
                e.y += (dy / dist) * e.speed;

                if (dist < COLLISION_ATTACK) {
                    e.attack();
                    player.hurt();
                    stats.lives--;
                    this.gameStore.leftActiveAim();
                    // stats.combo = 0;
                    if (stats.lives <= 0) {
                        this.gameStore.gameOver = true;
                    }
                }
            });
    }

    #lookAtNearestEnemy() {
        const {player, enemies} = this.gameStore;

        if (player.hasActiveAim || !enemies.length || player.isHurt) return;

        let nearest = null;
        let minDist = Infinity;

        for (const e of enemies) {
            if (e.isDead) continue;
            const dx = e.x - player.x;
            const dy = e.y - player.y;
            const dist = Math.hypot(dx, dy);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }

        if (!nearest) return;

        const dx = nearest.x - player.x;
        const dy = nearest.y - player.y;
        const angle = Math.atan2(dy, dx);
        player.updateAnimation(Animation.IDLE, angle);
    }
}
