import {sprites} from "@/sprites/config/sprites.js";
import {resolveAsset} from "@/utils/assets.js";

export async function loadSprites() {
    const entities = Object.entries(sprites);


    await Promise.all(
        entities.map(async ([entityName, spriteSet]) => {
            await Promise.all(
                Object.entries(spriteSet).map(([animName, cfg]) =>
                    new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            spriteSet[animName] = { ...cfg, image: img };
                            console.log(`✅ Loaded: ${entityName}/${animName}`);
                            resolve();
                        };
                        img.onerror = () => reject(new Error(`❌ Failed to load ${entityName}/${animName}`));
                        img.src = resolveAsset(cfg.src)
                    })
                )
            );
        })
    );
}

export function getSprite(entity, animation, direction = null) {
    const spriteKey =  direction ? `${animation}_${direction}` : animation
    const cfg = sprites[entity]?.[spriteKey];
    if (!cfg || !cfg.image || !cfg.image.complete) {
        console.warn(`Sprite ${entity}/${spriteKey} not ready`);
        return null;
    }
    return cfg;
}

export class getSpriteWithoutDirection {
}