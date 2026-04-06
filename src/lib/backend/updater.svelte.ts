import { browser } from '$app/environment';
import { sleep } from '$lib/util/interval.svelte';

let updater: WebSocket | undefined | false = $state(browser && undefined);
let interval: number;
let disconnect = false;

export const connectWebsocket = <T>(
  user: string,
  handleMessage: (msg: T, user: string) => void
) => {
  if (updater === false || updater) return;
  createWebsocket(user, handleMessage);
};

const createWebsocket = <T>(
  user: string,
  handleMessage: (msg: T, user: string) => void
) => {
  updater = new WebSocket('/api/ws/updater');

  updater.onmessage = (event) => {
    const msg: T = JSON.parse(event.data);
    handleMessage(msg, user);
  };

  updater.onclose = async () => {
    clearInterval(interval);
    if (disconnect) return;
    await sleep(1000);
    createWebsocket(user, handleMessage);
  };

  interval = setInterval(() => {
    if (
      !updater ||
      updater.readyState === updater.CLOSING ||
      updater.readyState === updater.CLOSED
    ) {
      clearInterval(interval);
      return;
    }

    updater.send('heartbeat');
  }, 10000) as unknown as number;
};

export const disconnectWebsocket = () => {
  if (updater) {
    disconnect = true;
    updater.close();
    updater = undefined;
  }
};
