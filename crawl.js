export { normalizeURL, getURLsFromHTML };
import { JSDOM } from 'jsdom';

function normalizeURL(url) {
    console.log(url)
    let urlObject = new URL(url);
    let path = urlObject.pathname;
    if(path && path[path.length - 1] == '/') {
        path = path.slice(0, -1);
    }
    return `${urlObject.host}${path}`
}

function getURLsFromHTML(html, baseUrl) {
    const dom = new JSDOM(html);
    const anchorTags = dom.window.document.querySelectorAll('a')
    const links = [];
    for(const tag of anchorTags) {
        if(tag.href) {
            let href = tag.href;
            try {
                href = new URL(href, baseUrl).href;
                links.push(href);
            } catch(err) {
                console.log(`Received ${err.message}, while processing ${href}`)
            }
        }
    }
    
    return links
}