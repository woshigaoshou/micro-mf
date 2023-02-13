import { rewriteRouter } from './rewrite-router';

let microApps = [];

export const getApp = () => microApps;

  
// 17:35
export const registerMicroApps = (apps, lifeCycles) => {
  microApps = apps;
}

export const start = (options) => {
  console.log('start')
  rewriteRouter();
}
