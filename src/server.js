    import { WebSocketServer } from 'ws';

    const wss = new WebSocketServer({ port: 8080 });
    const rooms = new Map(); // roomId -> { clients: WebSocket[] }

    function others(roomId, ws) {
        const room = rooms.get(roomId);
        return room ? room.clients.filter(c => c !== ws) : [];
    }

    wss.on('connection', ws => {
        let roomId = null;

        ws.on('message', raw => {
            const data = JSON.parse(raw);

            if (data.type === 'join') {
                roomId = data.room;
                if (!rooms.has(roomId)) rooms.set(roomId, { clients: [] });
                const room = rooms.get(roomId);
                if (!room.clients.includes(ws)) room.clients.push(ws);

                const role = room.clients.length === 1 ? 'offerer' : 'answerer';
                ws.send(JSON.stringify({ type: 'role', role }));

                if (room.clients.length === 2) {
                    room.clients.forEach(c => c.readyState === ws.OPEN && c.send(JSON.stringify({ type: 'ready' })));
                }
                return;
            }

            if (roomId) {
                for (const peer of others(roomId, ws)) {
                    if (peer.readyState === ws.OPEN) peer.send(JSON.stringify(data));
                }
            }
        });

        ws.on('close', () => {
            if (!roomId) return;
            const room = rooms.get(roomId);
            if (!room) return;
            room.clients = room.clients.filter(c => c !== ws);
            // уведомим оставшегося, чтобы он сбросил состояние при разрыве
            room.clients.forEach(c => c.readyState === ws.OPEN && c.send(JSON.stringify({ type: 'peer-left' })));
            if (room.clients.length === 0) rooms.delete(roomId);
        });
    });

    console.log('Сервер сигналинга запущен на ws://localhost:8080');
