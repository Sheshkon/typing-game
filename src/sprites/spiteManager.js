import {Effect} from '@/entity/effect.js';
import {sprites} from '@/sprites/config/sprites.js';
import {useGameStore} from '@/stores/game.js';
import {Animation} from '@/types/animation.js';
import {resolveAsset} from '@/utils/assets.js';

export async function loadAssets() {
    const entities = Object.entries(sprites);

    await Promise.all([
        ...entities.map(async ([entityName, spriteSet]) => {
            await Promise.all(
                Object.entries(spriteSet).map(([animName, cfg]) =>
                    new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            spriteSet[animName] = {...cfg, image: img};
                            console.log(`✅ Loaded: ${entityName}/${animName}`);
                            resolve();
                        };
                        img.onerror = () =>
                            reject(new Error(`❌ Failed to load ${entityName}/${animName}`));
                        img.src = resolveAsset(cfg.src);
                    })
                )
            );
        }),

        new Promise((resolve, reject) => {
            const bg = new Image();
            bg.onload = () => {
                console.log('✅ Background loaded');
                resolve();
            };
            bg.onerror = () => reject(new Error('❌ Failed to load background'));
            bg.src = resolveAsset('background-compressed.png');
        })
    ]);

    const gameStore = useGameStore();

    gameStore.effects = {
        [Animation.COMBO]: new Effect(Animation.COMBO),
        [Animation.HEAL]: new Effect(Animation.HEAL)
    };
}

export function getSprite(entity, animation, direction = null) {
    const spriteKey = direction ? `${animation}_${direction}` : animation;
    const cfg = sprites[entity]?.[spriteKey];
    if (!cfg || !cfg.image || !cfg.image.complete) {
        console.warn(`Sprite ${entity}/${spriteKey} not ready`);
        return null;
    }
    return cfg;
}
