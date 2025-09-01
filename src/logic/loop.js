import {notify} from '@kyvg/vue3-notification';

import {useExtendedStats} from '@/composables/useExtendedStats.js';
import {useGameResults} from '@/composables/useGameResults.js';
import {NOTIFICATION_DURATION} from '@/constants.js';
import {i18n} from '@/i18n.js';
import {locales} from '@/locales/locale.js';
import {AnimationController} from '@/logic/animation.js';
import {MoveController} from '@/logic/move.js';
import {Spawner} from '@/logic/spawn.js';
import {stopSound} from '@/sound/sound.js';
import {useGameStore} from '@/stores/game.js';
import {GameResultsRepo} from '@/stores/repository.js';

const {fetchData: updateGameResults} = useGameResults();
const {fetchStats: updateExtendedStats} = useExtendedStats();

export class LoopController {
    constructor(ctx) {
        this.ctx = ctx;
        this.lastTime = 0;
        this.gameLoopId = null;
        this.animLoopId = null;
        this.spawnTimerId = null;
        this.isRunning = false;
        this.gameStore = useGameStore();
        this.moveController = new MoveController();
        this.animationCotroller = new AnimationController(ctx);
        this.spawner = new Spawner();
    }

    start() {
        if (this.isRunning) return;
        // playSound(Sound.BACKGROUND, true)
        this.stop();
        this.lastTime = performance.now();
        this.isRunning = true;
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
        this.animLoopId = requestAnimationFrame(() => this.animLoop());
        this.spawnLoop();
        this.gameStore.stats.last.startTime = Date.now();
        this.gameStore.stats.last.attempt++;
    }

    stop() {
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        if (this.animLoopId) cancelAnimationFrame(this.animLoopId);
        if (this.spawnTimerId) clearInterval(this.spawnTimerId);

        this.gameLoopId = this.animLoopId = this.spawnTimerId = null;
        this.isRunning = false;
    }

    restart() {
        this.stop();
        this.gameStore.resetGame();
        this.start();
        this.gameStore.gameOver = false;
    }

    spawnLoop() {
        if(!this.gameStore.gameOver) this.spawner.spawnEnemy();
        const delay = this.gameStore.levelConfig.spawnInterval;
        this.spawnTimerId = setTimeout(() => this.spawnLoop(), delay);
    }

    async gameLoop() {
        if (!this.isRunning) return;
        if (this.gameStore.gameOver) {
            stopSound();
            this.gameStore.stats.last.endTime = Date.now();
            await this.#handleResult();
            return;
        }
        this.moveController.update(this.gameStore);
        this.gameLoopId = requestAnimationFrame(async () => await this.gameLoop());
    }

    animLoop() {
        if (!this.isRunning) return;
        const delta = this.#getDelta();
        this.animationCotroller.update(delta);
        this.animLoopId = requestAnimationFrame(() => this.animLoop());
    }

    async #handleResult() {
        const {stats, level} = this.gameStore;
        const {labels, language} = locales[i18n.global.locale.value];
        if (stats.score <= 0) {
            this.#notify(`<b>${labels.score}:</b> ${stats.score}<br>`, labels);
            return;
        }
        const result = await GameResultsRepo.save(stats, language, {level});
        this.#sendResultNotification(result, labels);
        await this.#updateData();
    }

    #getDelta() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        return delta;
    }

    #sendResultNotification(result, labels) {
        const msg = this.#buildGameOverNotificationMessage(result, labels);
        this.#notify(msg, labels);
    }

    #notify(msg, labels) {
        console.log(msg);
        notify({
            type: this.gameStore.stats.last.attempt % 2 ? 'warn' : 'success',
            duration: NOTIFICATION_DURATION,
            title: labels.results,
            text: msg,
        });
    }

    #buildGameOverNotificationMessage(result, labels) {
        return `<b>${labels.score}:</b> ${result.score}<br>`;
        //     return `
        //         <b>${result.language}</b><br>
        //         <b>${result.attempt}:</b> #${result.attempt}<br>
        //         <b>${labels.score}:</b> ${result.score}<br>
        //         <b>${labels.combo}:</b> ${result.comboCount}<br>
        //         <b>${labels.heal}:</b> ${result.healCount}<br>
        //         <b>${labels.wrong}:</b> ${result.wrongWordsCount}<br>
        //         <b>${labels.correct}:</b> ${result.correctWordsCount}<br>
        //         <b>${labels.accuracy}:</b> ${result.accuracy}%<br>
        //         <b>${labels.duration}:</b> ${result.duration}<br>
        // `;
    }

    async #updateData() {
        await updateGameResults();
        await updateExtendedStats();
    }
}
