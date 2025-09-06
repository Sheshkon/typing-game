import {initializeApp} from 'firebase/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    initializeFirestore,
    onSnapshot,
    setDoc
} from 'firebase/firestore';
import {ref} from 'vue';

import {firebaseConfig} from '@/composables/config.js';
import {useGameStore} from '@/stores/game.js';

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

async function cleanupRoom(roomId) {
    if (!roomId) return;
    try {
        const offerSnap = await getDocs(collection(db, 'rooms', roomId, 'offerCandidates'));
        for (const c of offerSnap.docs) await deleteDoc(c.ref);

        const answerSnap = await getDocs(collection(db, 'rooms', roomId, 'answerCandidates'));
        for (const c of answerSnap.docs) await deleteDoc(c.ref);

        await deleteDoc(doc(db, 'rooms', roomId));
        console.log(`Комната ${roomId} удалена`);
    } catch (err) {
        console.error('Ошибка при очистке комнаты:', err);
    }
}

export function useWebRTC(initialRoomId, onMessage) {
    const status = ref('Waiting for opponent');
    const inviteLink = ref(null);
    const gameStore = useGameStore();

    let pc = null;
    let channel = null;
    let roomId = initialRoomId || null;
    let isOfferer = false;
    let sendTimer = null;

    function createPeerConnection() {
        pc = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
        });

        pc.onicecandidate = e => {
            if (e.candidate && roomId) {
                const candidatesCol = collection(
                    db,
                    'rooms',
                    roomId,
                    isOfferer ? 'offerCandidates' : 'answerCandidates'
                );
                addDoc(candidatesCol, e.candidate.toJSON()).catch(console.error);
            }
        };

        pc.ondatachannel = e => {
            channel = e.channel;
            setupChannel();
        };

        pc.onconnectionstatechange = async () => {
            status.value = pc.connectionState;
            if (pc.connectionState === 'connected') {
                gameStore.isMultiplayer = true;
                startAutoSend(2000, ping);
                if (roomId) {
                    setTimeout(async () => {
                        await cleanupRoom(roomId);
                    }, 3000);
                }
            }
        };
    }

    function ping() {
        return 'ping';
    }

    function setupChannel() {
        channel.onopen = () => (status.value = 'connected');
        channel.onmessage = e => {
            try {
                const data = JSON.parse(e.data);
                if (data.type === 'new-room') {
                    console.log('Получена новая ссылка от друга:', data.link);
                } else {
                    onMessage?.(data);
                }
            } catch {
                onMessage?.(e.data);
            }
        };
        channel.onclose = () => {
            status.value = 'closed';
            stopAutoSend();
        };
    }

    async function createRoom() {
        isOfferer = true;
        createPeerConnection();

        const roomRef = doc(collection(db, 'rooms'));
        roomId = roomRef.id;
        inviteLink.value = `${location.origin}${location.pathname}?room=${roomId}`;

        channel = pc.createDataChannel('chat');
        setupChannel();

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await setDoc(roomRef, {offer: {type: offer.type, sdp: offer.sdp}});

        onSnapshot(roomRef, snapshot => {
            const data = snapshot.data();
            if (data?.answer && !pc.currentRemoteDescription) {
                pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            }
        });

        onSnapshot(collection(db, 'rooms', roomId, 'answerCandidates'), snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                }
            });
        });

        return roomId;
    }

    async function joinRoom() {
        if (!roomId) throw new Error('roomId is empty');

        createPeerConnection();

        const roomRef = doc(db, 'rooms', roomId);
        const roomSnapshot = await getDoc(roomRef);
        if (!roomSnapshot.exists()) throw new Error('Комната не найдена');

        const offer = roomSnapshot.data().offer;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await setDoc(roomRef, {answer: {type: answer.type, sdp: answer.sdp}}, {merge: true});

        onSnapshot(collection(db, 'rooms', roomId, 'offerCandidates'), snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    pc.addIceCandidate(new RTCIceCandidate(change.doc.data()));
                }
            });
        });
    }

    function send(data) {
        if (channel?.readyState === 'open') {
            channel.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
    }

    function startAutoSend(intervalMs = 1000, payloadFn) {
        stopAutoSend();
        sendTimer = setInterval(() => {
            if (channel?.readyState === 'open') {
                const payload = payloadFn ? payloadFn() : {ts: Date.now()};
                send(payload);
            }
        }, intervalMs);
    }

    function stopAutoSend() {
        if (sendTimer) {
            clearInterval(sendTimer);
            sendTimer = null;
        }
    }

    async function regenerateRoom() {
        if (roomId) {
            await cleanupRoom(roomId);
        }
        if (pc) {
            try {
                pc.close();
            } catch {
                console.warn('error with close connection');
            }
        }
        status.value = 'Waiting for opponent';
        return await createRoom();
    }

    window.addEventListener('beforeunload', async () => {
        if (roomId) await cleanupRoom(roomId);
    });

    return {
        status,
        inviteLink,
        createRoom,
        joinRoom,
        send,
        startAutoSend,
        stopAutoSend,
        regenerateRoom
    };
}
