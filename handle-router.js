import { getApp } from './index';
import { getPrevRouter, getNextRouter } from './rewrite-router';
import { importHtml } from './import-html';

export const handleRouter = async () => {
  console.log('tag', 'handleRouter')
  const apps = getApp();
  const prevRouter = getPrevRouter();
  const nextRouter = getNextRouter();

  console.log(apps)
  const app = apps.find(item => nextRouter.startsWith(item.activeRule));
  const prevApp = apps.find(item => prevRouter.startsWith(item.activeRule));

  if (prevApp) {
    unmount(prevApp);
  }
  
  if (!app) return;
  
  const { template, getExternalScripts, execScripts } = await importHtml(app.entry);
  const container = document.querySelector(app.container);
  container.appendChild(template);
  
  // 定义全局变量
  window.__POWERED_BY_QIANKUN__ = true;
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry + '/';

  const apppExports = await execScripts();
  console.log(apppExports, 'appExports');
  
  app.bootstrap = apppExports.bootstrap;
  app.mount = apppExports.mount;
  app.unmount = apppExports.unmount;

  await bootstrap(app);
  await mount(app);
}

async function bootstrap (app) {
  app.bootstrap && (await app.bootstrap());
}

async function mount (app) {
  console.log(app.container, app);
  
  app.mount && (await app.mount({
    container: document.querySelector(app.container)
  }))
}

async function unmount (app) {
  document.querySelector(app.container).innerHTML = '';
  app.unmount && (await app.unmount());
}
