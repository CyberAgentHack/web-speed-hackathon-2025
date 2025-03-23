import { Settings } from 'luxon';

declare module 'luxon' {
  interface TSSettings {
    throwOnInvalid: true;
  }
}

Settings.defaultZone = 'Asia/Tokyo';
Settings.throwOnInvalid = true;