type Peer = { send: (data: string) => void }

const rooms = new Map<string, Set<Peer>>()
const peerRoom = new WeakMap<Peer, string>()

function broadcast(room: string) {
  const peers = rooms.get(room)
  if (!peers) return

  const payload = JSON.stringify({ room, count: peers.size })
  for (const peer of peers) {
    peer.send(payload)
  }
}

function leave(peer: Peer) {
  const room = peerRoom.get(peer)
  if (!room) return

  const peers = rooms.get(room)
  if (!peers) return

  peers.delete(peer)
  peerRoom.delete(peer)

  if (peers.size === 0) {
    rooms.delete(room)
    return
  }

  broadcast(room)
}

function join(peer: Peer, room: string) {
  if (peerRoom.get(peer) === room) {
    broadcast(room)
    return
  }

  leave(peer)

  let peers = rooms.get(room)
  if (!peers) {
    peers = new Set()
    rooms.set(room, peers)
  }

  peers.add(peer)
  peerRoom.set(peer, room)
  broadcast(room)
}

function parse(message: unknown): { type?: string; room?: string } | null {
  try {
    const raw = typeof message === 'string'
      ? message
      : typeof message === 'object' && message && 'toString' in message
        ? String(message)
        : null

    if (!raw) return null
    return JSON.parse(raw) as { type?: string; room?: string }
  }
  catch {
    return null
  }
}

export default defineWebSocketHandler({
  message(peer, message) {
    const data = parse(message)
    if (data?.type === 'join' && typeof data.room === 'string' && data.room.length > 0) {
      join(peer, data.room)
    }
  },
  close(peer) {
    leave(peer)
  },
})
