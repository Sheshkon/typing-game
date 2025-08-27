import {SPAWN_RADIUS} from '@/constants.js';
import {Enemy} from '@/entity/enemy.js';
import {playSound} from '@/sound/sound.js';
import {useGameStore} from '@/stores/game.js';
import {Sound} from '@/types/sound.js';
import {getDirectionByAngle} from '@/utils/direction.js';
import {nextWord} from '@/utils/word.js';

let spawningEnabled = true;

document.addEventListener('visibilitychange', () => {
    spawningEnabled = !document.hidden;
});

export class Spawner {
    constructor() {
        this.gameStore = useGameStore();
    }

    spawnEnemy() {
        if (!spawningEnabled) return;
        const sound = playSound(Sound.ENEMY_RUN, true);
        const {
            player,
            enemies,
            levelConfig,
        } = this.gameStore;

        const angle = Math.random() * Math.PI * 2;
        const enemy = new Enemy({
            x: player.x + Math.cos(angle) * SPAWN_RADIUS,
            y: player.y + Math.sin(angle) * SPAWN_RADIUS,
            angle,
            word: nextWord(levelConfig.words)
        });
        enemy.direction = getDirectionByAngle(angle + Math.PI);
        enemy.soundId = sound.id;
        enemies.push(enemy);
    }
}
