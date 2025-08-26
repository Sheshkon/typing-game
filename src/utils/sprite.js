import {Direction} from "@/types/direction.js";

const directions = Object.values(Direction);

export const getSpritesInfo = (subfolder, spriteConfig) => {

    const entries = [];

    for (const [name, cfg] of Object.entries(spriteConfig)) {
        if (cfg.isMultiDirectional) {
            directions.forEach(dir => {
                const key = `${name}_${dir}`;
                entries.push([
                    key,
                    {
                        src: `${subfolder}/${key}.png`,
                        ...cfg,
                        direction: dir
                    }
                ]);
            });
        } else {
            entries.push([
                name,
                {
                    src: `${subfolder}/${name}.png`,
                    ...cfg,
                    direction: cfg.direction ?? null
                }
            ]);
        }
    }

    return Object.fromEntries(entries);
};
