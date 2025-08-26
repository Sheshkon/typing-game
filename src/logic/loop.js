import {AnimationController} from '@/logic/animation.js';
import {MoveController} from '@/logic/move.js';
import {Spawner} from '@/logic/spawn.js';
import {stopSound} from '@/sound/sound.js';
import {useGameStore} from '@/stores/game.js';

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
    }

    spawnLoop() {
        this.spawner.spawnEnemy();
        const delay = this.gameStore.levelConfig.spawnInterval;
        this.spawnTimerId = setTimeout(() => this.spawnLoop(), delay);
    }

    stop() {
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        if (this.animLoopId) cancelAnimationFrame(this.animLoopId);
        if (this.spawnTimerId) clearInterval(this.spawnTimerId);

        this.gameLoopId = this.animLoopId = this.spawnTimerId = null;
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) return;
        if (this.gameStore.gameOver) {
            stopSound();
            this.stop();
            this.gameStore.updatePB();
            alert(`Game Is Over! Score: ${this.gameStore.stats.score}`);
            this.gameStore.resetGame();
            this.start();
            this.gameStore.gameOver = false;
            return;
        }
        this.moveController.update(this.gameStore);
        this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
    }

    animLoop() {
        if (!this.isRunning) return;
        const delta = this.#getDelta();
        this.animationCotroller.update(delta);
        this.animLoopId = requestAnimationFrame(() => this.animLoop());
    }

    #getDelta() {
        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;
        return delta;
    }
}
