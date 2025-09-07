import {COLLISION_ATTACK, GAME_OVER_SCALE_FACTOR, TEXT_ALIGN, TEXT_COLOR, TEXT_FONT} from '@/constants.js';
import {i18n} from '@/i18n.js';
import {locales} from '@/locales/locale.js';
import {getSprite} from '@/sprites/spiteManager.js';
import {useGameStore} from '@/stores/game.js';
import {Animation} from '@/types/animation.js';
import {Entity} from '@/types/entity.js';

export class AnimationController {
    constructor(ctx, isOpponent) {
        this.ctx = ctx;
        this.ctx.textAlign = TEXT_ALIGN;
        this.ctx.font = TEXT_FONT;
        this.ctx.fillStyle = TEXT_COLOR;
        this.store = useGameStore();
        this.isOpponent = isOpponent;
    }

    update(delta, gameState) {
        this.ctx.clearRect(0, 0, gameState.field.w, gameState.field.h);
        if (!this.isOpponent) {
            this.#update(delta, gameState);
        }

        this.#draw(gameState);
    }

    #update(delta, gameState) {
        const {entities, effects} = gameState;
        Object.values(effects).filter(effect => effect.isEnabled).forEach(e => this.#updateEffect(e, delta));
        entities
            .filter(e => e)
            .forEach(e => this.#updateSprite(e, delta, gameState));
    }

    #draw(gameState) {
        const {entities, effects} = gameState;
        Object.values(effects)
            .filter(e => e)
            .filter(e => e.isEnabled && e?.sprite)
            .forEach(e => this.#drawEffect(e.sprite));
        entities
            .filter(e => e)
            .forEach(e => this.#drawEntity(e));
        // this.#drawGameOver(gameState);
        this.#drawMultiplayer(gameState);
    }

    #updateEffect(effect, delta = null) {
        const {sprite} = effect;
        sprite.time += delta ?? 0;
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

    #updateSprite(entity, delta, gameState) {
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
                        const {player} = gameState;
                        const dx = entity.x - player.x;
                        const dy = entity.y - player.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (entity.isAttacking && dist < COLLISION_ATTACK) {
                            entity.isDead = true;
                        }
                    }
                }
                if (sprite.entity === Entity.PLAYER) {
                    entity.updateAnimation(Animation.IDLE);
                    gameState.leftActiveAim();
                }
            }
        }
    }

    #drawEntity(entity) {
        const {sprite} = entity;
        if (!sprite) return;

        const spriteConfig = getSprite(sprite.entity, sprite.animation, entity.direction);

        if (!spriteConfig) return;

        const {width, height, frames, image, scale} = spriteConfig;

        const frameWidth = width / frames;

        this.ctx.save();
        this.ctx.translate(entity.x, entity.y);
        this.ctx.scale(scale, scale);
        this.ctx.drawImage(
            image,
            entity.sprite.frame * frameWidth, 0, frameWidth, height,
            -frameWidth / 2, -height / 2, frameWidth, height
        );

        if (entity.word) {
            this.ctx.fillText(entity.word, 0, -height / 2);
        }
        this.ctx.restore();
    }

    #drawMultiplayer(gameState) {
        if (this.store.isMultiplayer && !this.store.opponentIsReady) {
            const {player} = gameState;
            this.ctx.save();
            this.ctx.translate(player.x, player.y);
            this.ctx.scale(GAME_OVER_SCALE_FACTOR, GAME_OVER_SCALE_FACTOR);
            const gameOverText = 'Waiting opponent';
            this.ctx.fillText(gameOverText, 0, -20);
            this.ctx.restore();
        }
    }

    #drawGameOver(gameState) {
        if (!gameState.gameOver) {
            return;
        }

        const {player} = gameState;
        this.ctx.translate(player.x, player.y);
        this.ctx.scale(GAME_OVER_SCALE_FACTOR, GAME_OVER_SCALE_FACTOR);
        const gameOverText = locales[i18n.global.locale.value].gameOver;
        this.ctx.fillText(gameOverText, 0, -20);
        this.ctx.restore();
    }
}
