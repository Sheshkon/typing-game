import {COLLISION_ATTACK, TEXT_ALIGN, TEXT_COLOR, TEXT_FONT} from '@/constants.js';
import {getSprite} from '@/sprites/spiteManager.js';
import {useGameStore} from '@/stores/game.js';
import {Animation} from '@/types/animation.js';
import {Entity} from '@/types/entity.js';

export class AnimationController {
    constructor(ctx) {
        this.ctx = ctx;
        this.gameStore = useGameStore();
    }

    update(delta) {
        const {field} = this.gameStore;
        this.ctx.clearRect(0, 0, field.w, field.h);
        this.#update(delta);
        this.#draw();
    }

    #update(delta) {
        const {entities, effects} = this.gameStore;
        Object.values(effects).filter(effect => effect.isEnabled).forEach(e => this.#updateEffect(e, delta));
        entities.forEach(e => this.#updateSprite(e, delta));
    }

    #draw() {
        const {entities, effects} = this.gameStore;
        Object.values(effects)
            .filter(e => e.isEnabled && e?.sprite)
            .forEach(e => this.#drawEffect(e.sprite));
        entities.forEach(e => this.#drawEntity(e));
    }

    #updateEffect(effect, delta) {
        const {sprite} = effect;
        sprite.time += delta;
        if (sprite.time > sprite.speed) {
            sprite.time = 0;
            sprite.frame++;
            if (sprite.frame >= sprite.frames) {
                sprite.frame = 0;
                if (!sprite.loop) {
                    effect.disable();
                }
            }
        }
    }

    #drawEffect(sprite) {
        const {width, height, frame, frames, image, x, y, scale} = sprite;
        const frameWidth = width / frames;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(
            image,
            frame * frameWidth, 0, frameWidth, height,
            -frameWidth / 2, -height / 2, frameWidth, height
        );
        this.ctx.restore();
    }


    #updateSprite(entity, delta) {
        const {sprite} = entity;

        if (!sprite) return;

        const config = getSprite(sprite.entity, sprite.animation, entity.direction);

        if (!config) return;

        sprite.time += delta;
        if (sprite.time > config.speed) {
            sprite.time = 0;
            sprite.frame++;
            if (sprite.frame >= config.frames) {
                if (config.loop) {
                    sprite.frame = 0;
                } else {
                    if (entity.isDyingOrDead) {
                        entity.isDead = true;
                    } else if (sprite.entity !== Entity.PLAYER) {
                        const {player} = this.gameStore;
                        const dx = entity.x - player.x;
                        const dy = entity.y - player.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (entity.isAttacking && dist < COLLISION_ATTACK) {
                            entity.isDead = true;
                        }
                    }
                }
                if(sprite.entity === Entity.PLAYER) {
                    entity.updateAnimation(Animation.IDLE);
                    this.gameStore.leftActiveAim();
                }
            }
        }
    }

    #drawEntity(entity) {
        const {sprite} = entity;
        if (!sprite) return;

        const spriteConfig = getSprite(sprite.entity, sprite.animation, entity.direction);

        if (!spriteConfig) return;

        const {width, height, frames, image} = spriteConfig;

        const frameWidth = width / frames;

        this.ctx.save();
        this.ctx.translate(entity.x, entity.y);
        this.ctx.scale(entity.scale, entity.scale);
        this.ctx.drawImage(
            image,
            entity.sprite.frame * frameWidth, 0, frameWidth, height,
            -frameWidth / 2, -height / 2, frameWidth, height
        );

        if (entity.word) {
            this.ctx.fillStyle = TEXT_COLOR;
            this.ctx.font = TEXT_FONT;
            this.ctx.textAlign = TEXT_ALIGN;
            this.ctx.fillText(entity.word, 0, -height / 2);
        }
        this.ctx.restore();
    }
}
