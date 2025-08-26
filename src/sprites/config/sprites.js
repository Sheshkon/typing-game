import {effectSpritesConfig} from "@/sprites/config/effect.js";
import {enemySpritesConfig} from "@/sprites/config/enemy.js";
import {playerSpritesConfig} from "@/sprites/config/player.js";
import {projectileSpritesConfig} from "@/sprites/config/projectile.js";
import {Entity} from "@/types/entity.js";
import {getSpritesInfo} from "@/utils/sprite.js";

export const sprites = {
    [Entity.PLAYER]: getSpritesInfo([Entity.PLAYER], playerSpritesConfig),
    [Entity.PROJECTILE]: getSpritesInfo([Entity.PROJECTILE], projectileSpritesConfig),
    [Entity.ENEMY]: getSpritesInfo([Entity.ENEMY], enemySpritesConfig),
    [Entity.EFFECT]: getSpritesInfo([Entity.EFFECT], effectSpritesConfig),
}
