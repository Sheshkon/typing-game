import {Animation} from '@/types/animation.js';

export const playerSpritesConfig = {
    [Animation.IDLE]: {
        frames: 8,
        width: 768,
        height: 80,
        speed: 100,
        loop: true,
        isMultiDirectional: true,
    },
    [Animation.HURT]: {
        frames: 8,
        width: 768,
        height: 80,
        speed: 100,
        loop: true,
        isMultiDirectional: true,
    },
    [Animation.ATTACK]: {
        frames: 8,
        width: 768,
        height: 80,
        speed: 50,
        loop: false,
        isMultiDirectional: true,
    },
};


