// import {Platform} from 'react-native';

// /**
//  * Default backend URL.
//  * - With `adb reverse tcp:4000 tcp:4000`, Android devices and emulators connect to http://localhost:4000.
//  * - If adb reverse is not active on an Android emulator, 10.0.2.2 points to host localhost.
//  * - On a physical device over Wi-Fi without adb reverse, use your LAN IP (e.g. 192.168.1.28).
//  */
// export const DEFAULT_SERVER_URL =
//   Platform.OS === 'android' ? 'http://localhost:4000' : 'http://localhost:4000';

// let currentServerUrl = DEFAULT_SERVER_URL;

// export const setServerUrl = (url: string) => {
//   currentServerUrl = url.replace(/\/+$/, '');
// };

// export const getServerUrl = () => currentServerUrl;

// export const getApiBaseUrl = () => `${currentServerUrl}/api`;


import {Platform} from 'react-native';

// Your PC's IPv4 address (run `ipconfig` -> "IPv4 Address").
// Phone and PC must be on the same Wi-Fi.
const PC_LAN_IP = '192.168.1.28'; // <-- change this to YOUR IP
const PORT = 4000;

export const DEFAULT_SERVER_URL =
  Platform.OS === 'android'
    ? `http://${PC_LAN_IP}:${PORT}`
    : `http://localhost:${PORT}`;

let currentServerUrl = DEFAULT_SERVER_URL;

export const setServerUrl = (url: string) => {
  currentServerUrl = url.replace(/\/+$/, '');
};

export const getServerUrl = () => currentServerUrl;

export const getApiBaseUrl = () => `${currentServerUrl}/api`;

/**
 * Turns a file URL returned by the backend into one the phone can open.
 * The backend builds URLs from BASE_URL (often http://localhost:4000), which
 * a physical device can't reach - so the host is swapped for the server the
 * app is actually talking to.
 */
export const toAbsoluteUrl = (url?: string | null): string | null => {
  if (!url) {
    return null;
  }
  const path = url.replace(/^https?:\/\/[^/]+/i, '');
  return `${currentServerUrl}${path.startsWith('/') ? '' : '/'}${path}`;
};