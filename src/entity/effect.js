import {getSprite} from "@/sprites/spiteManager.js";
import {Entity} from "@/types/entity.js";

export class Effect {
    constructor(animation) {
        this.type = animation;
        this.isEnabled = false;
        this.sprite = {
            ...getSprite(Entity.EFFECT, animation),
            time: 0,
            frame: 0
        };
    }

    enable() {
        this.isEnabled = true;
        this.sprite.time = 0;
        this.sprite.frame = 0;
    }

    disable() {
        this.isEnabled = false;
    }
}
