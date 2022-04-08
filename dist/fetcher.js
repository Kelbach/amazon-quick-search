"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require('axios');
const cheerio = require('cheerio');
let cards = [];
function fetchPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        //cheerio boilerplate that I found
        try {
            const response = yield axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            //this string in the query selector seems to cover each item
            //querySelect EVERYTHHING
            $("s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16").each((element) => {
                const thisCard = $(element);
                //find everything
                const name = thisCard.find('a-size-medium a-color-base a-text-normal').text();
                const itemUrl = thisCard.find('a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal').text();
                const priceWhole = thisCard.find('a-price-whole').text().ParseInt();
                const priceFraction = thisCard.find('a-price-fraction').text().ParseInt();
                const price = priceWhole + priceFraction / 100;
                const currentDate = new Date().toLocaleDateString();
                let newCard = {
                    name: name,
                    price: price,
                    url: itemUrl,
                    currentDate: currentDate
                };
                cards.push(newCard);
            });
        }
        catch (error) {
            throw error;
        }
        console.log(cards);
    });
}
fetchPage('https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1');
