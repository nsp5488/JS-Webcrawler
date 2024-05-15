import  {argv} from 'node:process';
import { crawlPage } from './crawl.js';

async function main() {
    if(argv.length > 3 || argv.length < 3) {
        console.log("This program requires exactly one argument!")
        return -1
    }
    console.log(`Beginning crawl from base URL: ${argv[2]}`)
    let pages = await crawlPage(argv[2]);
    console.log(pages)
}

main()