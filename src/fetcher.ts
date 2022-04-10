import axios from 'axios';
import * as cheerio from 'cheerio';

interface Card {
    name: string;
    price: string;
    url: any;
    currentDate: string;
}

async function fetchPage(url: string) {
    //cheerio boilerplate that I found
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const cards: Card[] = [];  
        //this string in the query selector seems to cover each item
        //querySelect EVERYTHHING
        $('div.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16').each((_idx, el) => {
            const card = $(el);
            //find everything
            const name = card.find('span.a-size-base-plus.a-color-base.a-text-normal').text();
            const itemUrl = card.find('a.a-link-normal.a-text-normal').attr('href');
            // const priceWhole = card.find('a-price-whole').text();
            // const priceFraction = card.find('a-price-fraction').text();
            const price = card.find('span.a-price > span.a-offscreen').text();
            const currentDate = new Date().toLocaleDateString();
            let newCard: Card = {
                name: name,
                price: price,
                url: itemUrl,
                currentDate: currentDate
            };
            cards.push(newCard);
        });
        return cards;
    } catch (error) {
        throw error;
    }
}

fetchPage('https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1').then((cards) => console.log(cards));