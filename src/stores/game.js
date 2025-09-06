import {defineStore} from 'pinia';

import {FIELD_SIZE, INITIAL_LIVES, VISIBLE_SIZE} from '@/constants.js';
import {Enemy} from '@/entity/enemy.js';
import {Player} from '@/entity/player.js';
import {Projectile} from '@/entity/projectile.js';
import {i18n} from '@/i18n.js';
import {getConfig} from '@/level/config.js';
import {locales} from '@/locales/locale.js';

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
        effects: {},
        projectiles: [Projectile],
        stats: {
            score: 0,
            combo: 0,
            lives: INITIAL_LIVES,
            pb: 0,
            last: {
                comboCount: 0,
                healCount: 0,
                wrongWordsCount: 0,
                correctWordsCount: 0,
                startTime: null,
                endTime: null,
                attempt: 0
            }
        },
        gameOver: false,
        input: '',
        startLevel: Number(localStorage.getItem('startLevel')) || 1,
        isMultiplayer: false,
        isReady: false,
        opponentIsReady: false
    }),

    getters: {
        typed: state => state.input.trim().toLowerCase(),
        entities: state => [state.player, ...state.enemies, ...state.projectiles],
        level: state => Math.floor(state.stats.score / 100) + state.startLevel,
        levelConfig: state => getConfig(i18n.global.locale.value, state.level),
        specialWords: () => locales[i18n.global.locale.value].specialWords,
        isReadyForMultiplayer: state => !state.isMultiplayer || state.opponentIsReady
    },

    actions: {
        clearInput() {
            this.input = '';
        },

        setStartLevel(level) {
            this.startLevel = level;
            localStorage.setItem('startLevel', String(level));
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
                lives: INITIAL_LIVES,
                last: {
                    ...this.stats.last,
                    comboCount: 0,
                    healCount: 0,
                    wrongWordsCount: 0,
                    correctWordsCount: 0,
                    startTime: null,
                    endTime: null
                }
            };
        },

        updateScore() {
            this.stats.score += this.levelConfig.scoresPerAction;
            if (this.stats.score > this.stats.pb) {
                this.stats.pb = this.stats.score;
            }
        },

        toggleMultiplayer() {
            this.isMultiplayer = !this.isMultiplayer;
            console.log('fsdf');
        }
    }
});
