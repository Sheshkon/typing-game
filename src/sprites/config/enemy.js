import {Animation} from '@/types/animation.js';

export const enemySpritesConfig = {
    [Animation.RUN]: {
        frames: 6,
        width: 288,
        height: 48,
        speed: 100,
        loop: true,
        isMultiDirectional: true,
        scale: 4,
    },

    [Animation.ATTACK]: {
        frames: 10,
        width: 480,
        height: 48,
        speed: 30,
        loop: false,
        isMultiDirectional: true,
        scale: 4,
    },

    [Animation.DEATH]: {
        frames: 9,
        width: 432,
        height: 48,
        speed: 50,
        loop: false,
        isMultiDirectional: true,
        scale: 4,
    },
};

