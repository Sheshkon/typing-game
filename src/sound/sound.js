import { Sound } from "@/types/sound.js"
import {resolveAsset} from "@/utils/assets.js";
import { Howl } from "howler"

const MAX_POOL_SIZE = 5

const POOL_CONFIG = {
    [Sound.ENEMY_RUN]: MAX_POOL_SIZE,
    [Sound.ENEMY_HURT]: MAX_POOL_SIZE,
    [Sound.ENEMY_ATTACK]: MAX_POOL_SIZE
}

function createPool(key, poolSize = 1) {
    return Array.from({ length: poolSize }, () =>
        new Howl({
            src: resolveAsset(`sound/${key}.mp3`),
            preload: true
        })
    )
}

export const SFX = Object.fromEntries(
    Object.values(Sound).map(key => [
        key,
        {
            pool: createPool(key, POOL_CONFIG[key] || 1),
            index: 0
        }
    ])
)

export function playSound(name, loop = false) {
    const sfxEntry = SFX[name]
    if (!sfxEntry) return null

    const sound = sfxEntry.pool[sfxEntry.index]
    sound.loop(loop)

    const id = sound.play()

    sfxEntry.index = (sfxEntry.index + 1) % sfxEntry.pool.length

    return { howl: sound, id }
}

export function stopSound(name, id) {
    if(!name) {
        Howler.stop()
    }

    const sfxEntry = SFX[name]
    if (!sfxEntry) return

    sfxEntry.pool.forEach(howl => howl.stop(id))
}
