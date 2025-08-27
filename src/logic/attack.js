import {COMBO_ATTACK_COST, COMBO_HEAL_COST, COMBO_LIMIT, INITIAL_LIVES} from '@/constants.js';
import {useGameStore} from '@/stores/game.js';
import {Animation} from '@/types/animation.js';


export class TypeController {

    constructor() {
        this.gameStore = useGameStore();
    }

    checkTyped() {
        const typed = this.gameStore.typed;
        if (!typed) return;

        const {stats, player, enemies, effects, specialWords} = this.gameStore;

        if (typed === specialWords.combo) {
            this.#tryCombo(stats, enemies);
            return;
        }

        if (typed === specialWords.heal) {
            this.#tryHeal(player, stats, effects);
            return;
        }

        const target = enemies
            .filter(e => !e.isDyingOrDead && !e.isAttacking)
            .find(e => e.word?.toLowerCase() === typed);

        this.#tryAttack(target, player, stats);
        this.gameStore.clearInput();
    }

    #tryAttack(target, player, stats) {
        if (target && !target.isUnderAttack) {
            const dx = target.x - player.x;
            const dy = target.y - player.y;
            const dist = Math.hypot(dx, dy);

            this.#lookAt(target.x, target.y);
            stats.last.correctWordsCount++;

            if (dist <= player.nearAttackRadius) {
                this.#kick(target);
            } else {
                this.#shoot(target);
            }
            if (stats.combo < COMBO_LIMIT) {
                stats.combo++;
            }
        } else {
            stats.combo = 0;
            stats.last.wrongWordsCount++;
        }
    }

    #tryHeal(player, stats, effects) {
        if (stats.combo >= COMBO_HEAL_COST && stats.lives < INITIAL_LIVES) {
            player.heal(effects);
            stats.lives++;
            stats.combo -= COMBO_HEAL_COST;
            stats.last.healCount++;
        }
        this.gameStore.clearInput();
    }

    #tryCombo(stats, enemies) {
        if (stats.combo >= COMBO_ATTACK_COST && enemies.filter(e => !e.isDyingOrDead).length) {
            this.#comboAttack();
            stats.combo -= COMBO_ATTACK_COST;
            stats.last.comboCount++;
        }
        this.gameStore.clearInput();
    }

    #lookAt(targetX, targetY) {
        const {player} = this.gameStore;
        this.gameStore.setActiveAim();
        const dx = targetX - player.x;
        const dy = targetY - player.y;
        const angle = Math.atan2(dy, dx);
        player.updateAnimation(Animation.IDLE, angle);
    }

    #kick(target) {
        const {player} = this.gameStore;
        player.attack();
        target.hurt();
        this.gameStore.updateScore();

    }

    #shoot(target) {
        const {player, projectiles} = this.gameStore;
        const projectile = player.shoot(target);
        if (projectile) {
            projectiles.push(projectile);
        }
    }

    #comboAttack() {
        const {player, enemies, effects} = this.gameStore;
        player.combo(effects);
        enemies
            .filter(e => !e.isDyingOrDead)
            .forEach(e => this.#shoot(e));
    }
}
