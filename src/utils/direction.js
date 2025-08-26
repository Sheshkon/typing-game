import {Direction} from "@/types/direction.js";

export function getDirectionByAngle(angle) {
    if (angle === null) return null;

    const normalized = (angle + 2 * Math.PI) % (2 * Math.PI);

    const sector = Math.round(normalized / (Math.PI / 2)) % 4;

    return [
        Direction.RIGHT,
        Direction.DOWN,
        Direction.LEFT,
        Direction.UP
    ][sector];
}
