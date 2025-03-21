import { isBrowser } from '../functions/is-browser.js';
import { CanTrack } from '../types/can-track.js';

const getLocalStorage = () =>
  isBrowser() && typeof localStorage !== 'undefined' ? localStorage : undefined;

export const getLocalStorageItem = ({
  key,
  canTrack,
}: {
  key: string;
} & CanTrack) => {
  try {
    if (canTrack) {
      return getLocalStorage()?.getItem(key);
    }
    return undefined;
  } catch (err) {
    console.debug('[LocalStorage] GET error: ', err);
  }
};

export const setLocalStorageItem = ({
  key,
  canTrack,
  value,
}: {
  key: string;
  value: string;
} & CanTrack) => {
  try {
    if (canTrack) {
      getLocalStorage()?.setItem(key, value);
    }
  } catch (err) {
    console.debug('[LocalStorage] SET error: ', err);
  }
};
