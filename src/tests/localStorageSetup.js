import path from 'path';

/* eslint-disable import/no-extraneous-dependencies */

import { LocalStorage } from 'node-localstorage';

global.localStorage = new LocalStorage(path.resolve(__dirname, 'localstorage'));
