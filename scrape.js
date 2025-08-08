
if (typeof File === 'undefined') {
    global.File = class File extends Blob {
        constructor(parts, name, options = {}) {
            super(parts, options);
            this.name = name;
            this.lastModified = options.lastModified || Date.now();
        }
    };
}

import { chromium } from 'playwright';

export default async function scrapePage(url) {
    const cheerio = await import('cheerio');
    const { load } = cheerio;

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const html = await page.content();
    await browser.close();

    const $ = load(html);

    const text = $('body').text().trim().replace(/\s+/g, ' ');

    const media = [];
    $('img').each((_, el) => {
        const src = $(el).attr('src');
        if (src) media.push(new URL(src, url).href);
    });
    $('video').each((_, el) => {
        const src = $(el).attr('src');
        if (src) media.push(new URL(src, url).href);
    });
    $('audio').each((_, el) => {
        const src = $(el).attr('src');
        if (src) media.push(new URL(src, url).href);
    });

    return { text, media };
}
