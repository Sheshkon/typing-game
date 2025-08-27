import {EntityBase} from '@/entity/base.js';
import {playSound, stopSound} from '@/sound/sound.js';
import {Animation} from '@/types/animation.js';
import {Entity} from '@/types/entity.js';
import {Sound} from '@/types/sound.js';

export class Enemy extends EntityBase {
    static _id = 0;

    constructor({x, y, angle, word}) {
        super({
            x,
            y,
            angle,
            entity: Entity.ENEMY,
            animation: Animation.RUN,
        });
        this.id = ++Enemy._id;
        this.word = word;
        this.speed = 1;
        this.soundId = null;
        this.isUnderAttack = false;
    }

    attack() {
        playSound(Sound.ENEMY_ATTACK);
        this.speed = 0;
        this.updateAnimation(Animation.ATTACK);
    }

    hurt() {
        this.updateAnimation(Animation.DEATH);
        playSound(Sound.ENEMY_HURT);
        stopSound(Sound.ENEMY_RUN, this.soundId);
        this.speed = 0;
    }
}
