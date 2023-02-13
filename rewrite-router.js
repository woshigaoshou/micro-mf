// hash模式：hashchange
// history模式：popstate、pushstate、replacestate
import { handleRouter } from './handle-router';

const rawReplaceState = window.history.replaceState;
const rawPushState = window.history.pushState;

let prevRouter = '';
let nextRouter = '';

export const getPrevRouter = () => prevRouter;
export const getNextRouter = () => nextRouter;


export const rewriteRouter = () => {
  window.addEventListener('popstate', () => {
    console.log('监听到popstate');
    prevRouter = nextRouter;
    nextRouter = window.location.pathname;
    handleRouter();
  })
  

  window.history.replaceState = function (...args) {
    prevRouter = window.location.pathname;
    const result = rawReplaceState.apply(window.history, args);
    nextRouter = window.location.pathname;

    handleRouter();

    return result;
  }

  
  window.history.pushState = function (...args) {
    prevRouter = window.location.pathname;
    const result = rawPushState.apply(window.history, args);
    nextRouter = window.location.pathname;
    console.log('push');
    
    handleRouter();

    return result;
  }

}
