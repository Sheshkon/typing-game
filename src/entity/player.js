import {NEAR_ATTACK_RADIUS} from "@/constants.js";
import {EntityBase} from "@/entity/base.js";
import {Projectile} from "@/entity/projectile.js";
import {playSound} from "@/sound/sound.js";
import {Animation} from "@/types/animation.js";
import {Direction} from "@/types/direction.js";
import {Entity} from "@/types/entity.js";
import {Sound} from "@/types/sound.js";

const SOUND_DELAY = 200

export class Player extends EntityBase {
    constructor(x, y) {
        super({
            x: x,
            y: y,
            scale: 2,
            angle: 0,
            entity: Entity.PLAYER,
            animation: Animation.IDLE,
        });
        this.nearAttackRadius = NEAR_ATTACK_RADIUS;
        this.hasActiveAim = false;
        this.direction = Direction.DOWN;
    }

    get isHurt() {
        return this.sprite.animation === Animation.HURT
    }

    hurt() {
        this.updateAnimation(Animation.HURT)
        setTimeout(() => playSound(Sound.PLAYER_HURT), SOUND_DELAY)
    }

    attack() {
        playSound(Sound.PLAYER_ATTACK)
        this.updateAnimation(Animation.ATTACK);
    }

    shoot(target) {
        const dx = target.x - this.x;
        const dy = target.y - this.y;

        if (!dx && !dy) return null

        playSound(Sound.SHOOT)

        target.isUnderAttack = true

        const dist = Math.sqrt(dx * dx + dy * dy);
        return new Projectile({
            x: this.x,
            y: this.y,
            vx: (dx / dist),
            vy: (dy / dist),
            targetId: target.id
        })
    }

    heal(effects) {
        effects[Animation.HEAL].enable()
        playSound(Sound.HEAL)
    }

    combo(effects) {
        effects[Animation.COMBO].enable()
        playSound(Sound.COMBO)

    }
}
