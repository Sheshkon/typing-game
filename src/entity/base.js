import {SpriteInfo} from '@/entity/spriteInfo.js';
import {Animation} from '@/types/animation.js';
import {getDirectionByAngle} from '@/utils/direction.js';

export class EntityBase {
    constructor({x, y, scale, angle, entity, animation}) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.angle = angle;
        this.sprite = new SpriteInfo(entity, animation);
        this.direction = getDirectionByAngle(angle);
        this.isDead = false;
    }

    get isDying() {
        return this.sprite.animation === Animation.DEATH;
    }

    get isAttacking() {
        return this.sprite.animation === Animation.ATTACK;
    }

    get isDyingOrDead() {
        return this.isDying || this.isDead;
    }

    updateAnimation(animation, angle = null) {
        const direction = angle ? getDirectionByAngle(angle) : this.direction;
        if ((animation === this.sprite.animation) && (direction === this.direction)) {
            return;
        }
        if(angle) {
            this.angle = angle;
        }
        this.direction = direction;
        this.sprite = {
            ...this.sprite,
            animation,
            time: 0,
            frame: 0
        };
    }
}
