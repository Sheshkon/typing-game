export function gameStringify(storeState) {

    return JSON.stringify({
        field: storeState.field,
        player: storeState.player,
        enemies: storeState.enemies,
        projectiles: storeState.projectiles,
        effects: storeState.effects,
        entities: [storeState.player, ...storeState.enemies, ...storeState.projectiles],
        leftActiveAim: () => {}
    });

    // return JSON.stringify(storeState);
}
