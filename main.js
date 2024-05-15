import  {argv} from 'node:process';
import { crawlPage } from './crawl.js';

async function main() {
    if(argv.length > 3 || argv.length < 3) {
        console.log("This program requires exactly one argument!")
        return -1
    }
    console.log(`Beginning crawl from base URL: ${argv[2]}`)
    let pages = await crawlPage(argv[2]);
    printReport(pages, argv[2])
}

function sortPages(pages) {
    let pageArray = []
    for(let page in pages) {
        pageArray.push({'count':pages[page], 'page': page})
    }

    pageArray.sort((a, b) => {
        a.count > b.count
    })
    return pageArray;
}

function printReport(pages, url) {
    console.log(`Report starting for ${url}!`);
    const sortedPages = sortPages(pages);
    for(const page of sortedPages) {
        console.log(`Found ${page.count} internal link${page.count == 1 ? '' : 's'} to ${page.page}`)
    }

}
main()