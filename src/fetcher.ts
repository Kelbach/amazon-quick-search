const axios = require('axios');
const cheerio = require('cheerio');

interface Card {
    name: string;
    price: number;
    url: string;
    currentDate: string;
}

let cards: Card[] = [];

async function fetchPage(url: string) {
    //cheerio boilerplate that I found
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
          
        //this string in the query selector seems to cover each item
        //querySelect EVERYTHHING
        $("s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16").each((element: any) => {
            const thisCard = $(element)

            //find everything
            const name = thisCard.find('a-size-medium a-color-base a-text-normal').text()
            const itemUrl = thisCard.find('a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal').text()
            const priceWhole = thisCard.find('a-price-whole').text().ParseInt();
            const priceFraction = thisCard.find('a-price-fraction').text().ParseInt();
            const price = priceWhole + priceFraction/100;
            const currentDate = new Date().toLocaleDateString();

            let newCard: Card = {
                name: name,
                price: price,
                url: itemUrl,
                currentDate: currentDate
            }

            cards.push(newCard)
        });

    } catch (error) {
        throw error;
    }
    console.log(cards);
}

fetchPage('https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1');