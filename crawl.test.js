import {test, expect} from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl";

function TestBasicURLNormalization() {
    const expected = 'blog.boot.dev/path'
    const urls = [
    'https://blog.boOt.dev/path/',
    'https://blog.boot.dev/path',
    'http://blog.boot.dev/path/',
    'http://blog.boot.dev/path'
    ];
    for(let url of urls) {
        expect(normalizeURL(url)).toBe(expected)
    }    
}

function testHTMLToURL() {
    let html = '<html>\
    <body>\
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>\
        <a href="http://google.com"><span>Google!</span></a>\
        <a href="/path"><span>Google!</span></a>\
    </body>\
</html>'
    let expected = ['https://blog.boot.dev/', "http://google.com/", "https://blog.boot.dev/path"]

    expect(JSON.stringify(getURLsFromHTML(html, "https://blog.boot.dev"))).toBe(JSON.stringify(expected));
}

function testHTMLToNormalizedURL() {
    let html = '<html>\
    <body>\
        <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>\
        <a href="http://google.com"><span>Google!</span></a>\
        <a href="/path"><span>Google!</span></a>\
    </body>\
</html>'
    let expected = ['blog.boot.dev', "google.com", "blog.boot.dev/path"]
    let links = getURLsFromHTML(html, "https://blog.boot.dev")

    let normalized = []
    for(let i = 0; i < links.length; i++) {
        normalized.push(normalizeURL(links[i]));
    }
    expect(JSON.stringify(normalized)).toBe(JSON.stringify(expected));
}

test("TestBasicURLNormalization", TestBasicURLNormalization)
test("testHTMLToURL", testHTMLToURL)
test("testChainedHTMLToNormalized", testHTMLToNormalizedURL)