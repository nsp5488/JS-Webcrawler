export { normalizeURL, getURLsFromHTML, crawlPage };
import { JSDOM } from 'jsdom';

function normalizeURL(url) {
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
                console.log(`Received ${err.message}, while processing ${baseUrl}/${href}`)
            }
        }
    }
    
    return links
}

async function crawlPage(baseUrl, currentUrl=baseUrl, pages={}) {
    // check domain:
    let domain = new URL(baseUrl).hostname;
    if(!currentUrl.includes(domain)){
        return pages;
    }
    const currentUrlNormalized = normalizeURL(currentUrl);
    if(pages[currentUrlNormalized]){
        pages[currentUrlNormalized]++;
        return;
    } else {
        pages[currentUrlNormalized] = 1;
    }
    const html = await getPageAndParseIt(currentUrl);
    const urls = getURLsFromHTML(html, baseUrl);
    if(urls) {
        for(const url of urls) {
            crawlPage(baseUrl, url, pages);
        }
    }

    return pages;
}

async function getPageAndParseIt(url) {
    let response
    try {
    response = await fetch(url, {
        method:'GET',
        mode:'cors',
    });
    } catch(err) {
        console.log(`Encountered ${err.message} while fetching ${url}`)
        return
    }
    if(response.status >= 400) {
        console.log(`Error: ${response.statusText}`);
        return
    }
    

    if(response.headers.has('content-type') && !response.headers.get('content-type').includes('text/html')) {
        console.log(`Invalid content type: ${response.headers.get('content-type')} on page ${url}`);
        return
    }
    return await response.text();
}