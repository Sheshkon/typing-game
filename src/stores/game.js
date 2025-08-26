import {defineStore} from 'pinia';

import {FIELD_SIZE, INITIAL_LIVES, VISIBLE_SIZE} from '@/constants.js';
import {Enemy} from '@/entity/enemy.js';
import {Player} from '@/entity/player.js';
import {Projectile} from '@/entity/projectile.js';
import {getConfig} from '@/level/level.js';

export const useGameStore = defineStore('gameStore', {
    state: () => ({
        field: {
            w: FIELD_SIZE,
            h: FIELD_SIZE,
            vw: VISIBLE_SIZE,
            vh: VISIBLE_SIZE
        },
        player: new Player(FIELD_SIZE / 2, FIELD_SIZE / 2),
        enemies: [Enemy],
        effects: {

        },
        projectiles: [Projectile],

        stats: {
            score: 0,
            combo: 0,
            lives: INITIAL_LIVES,
            pb: 0
        },
        gameOver: false,
        input: '',
        startLevel: 1
    }),

    getters: {
        typed: state => state.input.trim().toLowerCase(),
        entities: state => [...state.enemies, state.player,...state.projectiles],
        level: state =>  Math.floor(state.stats.score / 100) + state.startLevel,
        levelConfig: state => getConfig('en', state.level)
    },

    actions: {
        clearInput() {
            this.input = '';
        },

        setActiveAim() {
            this.player.hasActiveAim = true;
        },

        leftActiveAim() {
            this.player.hasActiveAim = false;
        },

        resetGame() {
            this.player = new Player(FIELD_SIZE / 2, FIELD_SIZE / 2);
            this.enemies = [];
            this.projectiles = [];
            this.gameOver = false;
            this.stats = {
                ...this.stats,
                score: 0,
                combo: 0,
                lives: INITIAL_LIVES
            };
        },

        updatePB() {
            if (this.stats.score > this.stats.pb){
                this.stats.pb = this.stats.score;
            }
        }
    }
});
