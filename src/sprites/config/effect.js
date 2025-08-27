import {FIELD_SIZE} from '@/constants.js';
import {Animation} from '@/types/animation.js';

export const effectSpritesConfig = {
    [Animation.COMBO]: {
        frames: 12,
        width: 774,
        height: 57,
        speed: 50,
        loop: false,
        x: FIELD_SIZE / 2 - 6,
        y: FIELD_SIZE / 2,
        scale: 4
    },
    [Animation.HEAL]: {
        frames: 12,
        width: 774,
        height: 57,
        speed: 50,
        loop: false,
        x: FIELD_SIZE / 2 - 6,
        y: FIELD_SIZE / 2,
        scale: 4
    },
};

