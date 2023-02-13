import { fetchResource } from './fetch-resource';

export const importHtml = async (url) => {
  const html = await fetchResource(url);
  
  const template = document.createElement('div');
  template.innerHTML = html;
  let scripts = template.querySelectorAll('script');
  console.log(scripts);
  

  const getExternalScripts = () => {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src');
      console.log(src);
      
      if (!src) return Promise.resolve(script.innerHTML);
      console.log(src);
      
      return fetchResource((src.startsWith('http') ? '' : url) + src);
    }))
  }

  const execScripts = async () => {
    console.log('exec');
    const module = { exports: {} };
    const exports = module.exports;
    
    const scripts = await getExternalScripts();
    console.log(scripts);
    
    scripts.forEach(script => {
      eval(script);
    })

    return module.exports;
  }

  return {
    template,
    getExternalScripts,
    execScripts
  }
}
