export function gameStringify(storeState) {

    return JSON.stringify({
        field: storeState.field,
        player: storeState.player,
        enemies: storeState.enemies,
        projectiles: storeState.projectiles,
        effects: storeState.effects,
        entities: [storeState.player, ...storeState.enemies, ...storeState.projectiles],
        stats: storeState.stats,
        score: storeState.score,
        isMultiplayer: storeState.isMultiplayer,
        isReady: storeState.isReady,
        opponentIsReady: storeState.opponentIsReady,
        multiplayerBestScore: storeState.multiplayerBestScore,
        opponentBestScore: storeState.opponentBestScore,
        opponentCurrentScore: storeState.opponentCurrentScore,
        room: storeState.room,
        connectionStatus: storeState.connectionStatus,
        leftActiveAim: () => {}
    });

    // return JSON.stringify(storeState);
}
