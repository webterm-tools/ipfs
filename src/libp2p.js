import WS from 'libp2p-websockets';
import WebRTCStar from 'libp2p-webrtc-star';
import Multiplex from 'libp2p-mplex';
import { NOISE } from '@chainsafe/libp2p-noise';
import KadDHT from 'libp2p-kad-dht';
import GossipSub from 'libp2p-gossipsub';
import {
  validator,
  selector
} from './utils/ipns.js';
import websocketMaFilters from "libp2p-websockets/src/filters.js";

export function libp2pConfig() {
  const options = {
    dialer: {
      maxParallelDials: 150,
      maxDialsPerPeer: 4,
      dialTimeout: 10000
    },
    modules: {
      transport: [
        WS,
        WebRTCStar
      ],
      streamMuxer: [Multiplex],
      connEncryption: [NOISE],
      peerDiscovery: [],
      dht: KadDHT,
      pubsub: GossipSub
    },
    config: {
      peerDiscovery: {
        autoDial: true,
        bootstrap: { enabled: true },
        webRTCStar: { enabled: true }
      },
      dht: {
        kBucketSize: 20,
        enabled: false,
        clientMode: true,
        randomWalk: { enabled: false },
        validators: { ipns: validator },
        selectors: { ipns: selector }
      },
      pubsub: {
        enabled: true,
        emitSelf: true
      },
      nat: { enabled: false },
      config: {
        transport: {
          //Probably want a hybrid where some are wss and some can be ip4/ws (like localhost)
          [WS.prototype[Symbol.toStringTag]]: {
            filter: websocketMaFilters.all,
          },
        }
      }
    },
    metrics: { enabled: true },
    peerStore: {
      persistence: true,
      threshold: 1
    }
  };
  return options;
}