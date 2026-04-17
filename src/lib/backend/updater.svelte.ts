import { browser } from '$app/environment';
import { sleep } from '$lib/util/interval.svelte';

let updater: WebSocket | undefined | false = $state(browser && undefined);
let interval = 0;
let disconnect = false;

// oxlint-disable-next-line no-unnecessary-type-parameters
export const connectWebsocket = <T>(
  user: string,
  handleMessage: (msg: T, user: string) => void
) => {
  if (updater === false || updater) {
    return;
  }
  createWebsocket(user, handleMessage);
};

// oxlint-disable-next-line no-unnecessary-type-parameters
const createWebsocket = <T>(
  user: string,
  handleMessage: (msg: T, user: string) => void
) => {
  updater = new WebSocket('/api/ws/updater');

  // oxlint-disable-next-line prefer-add-event-listener
  updater.onmessage = (event) => {
    const msg: T = JSON.parse(event.data);
    handleMessage(msg, user);
  };

  // oxlint-disable-next-line prefer-add-event-listener
  updater.onclose = async () => {
    clearInterval(interval);
    if (disconnect) {
      return;
    }
    await sleep(1000);
    createWebsocket(user, handleMessage);
  };

  // oxlint-disable-next-line no-unsafe-type-assertion
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
  }, 10_000) as unknown as number;
};

export const disconnectWebsocket = () => {
  if (updater) {
    disconnect = true;
    updater.close();
    updater = undefined;
  }
};
