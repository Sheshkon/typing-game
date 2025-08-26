import {PROJECTILE_SPEED} from "@/constants.js";
import {EntityBase} from "@/entity/base.js";
import {Animation} from "@/types/animation.js";
import {Entity} from "@/types/entity.js";

export class Projectile extends EntityBase {
    static _id = 0
    constructor({x, y, vx, vy, targetId}) {
        super({
            x,
            y,
            angle: 0,
            scale: 1,
            entity: Entity.PROJECTILE,
            animation: Animation.IDLE,
        });
        this.id = ++Projectile._id
        this.vx = vx * PROJECTILE_SPEED
        this.vy = vy * PROJECTILE_SPEED
        this.targetId = targetId
        this.direction = null
    }
}
