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
Object.defineProperty(exports, "__esModule", { value: true });
// importing cheerio, a node package that turns HTML into an api call
const cheerio = require("cheerio");
const axios = require("axios");
const { chromium } = require('playwright');
const fs = require('fs');
// interface CardList {
//     id: number;
//     price: number;
// }
let cards = [];
// const cardlist: CardList[] = [];
// let AUrl: string = (new URL(document.location)).searchParams;
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
    });
}
// //might have to change data type here
// function filterCards(data: Array<Card>) {
// }
// //cant find the right data type for 'err', gonna use a node package
function printCards() {
    let csv = cards.map(element => {
        return Object.values(element).map(item => `"${item}"`).join(',');
    }).join("\n");
    fs.writeFile('saved-cards.csv', "Name, Price, URL, Date" + '\n' + csv, 'utf8', function (err) {
        if (err)
            throw err;
        console.log('complete');
    });
}
// function findLowestPrice() {
//     for (let i=0; i<30; i++) {
//         // data-index at i
//         //if data-asin null or a-link-normal does not include card name then skip
//         //else push data-index and query select and push a-price-whole + a-price-fraction/100
//     }
//     //arrange CardList low to high
//     //query select first three by data-index, collect
// }
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield chromium.launch({
        headless: false
    });
    const context = yield browser.newContext();
    // Open new page
    const page = yield context.newPage();
    // Go to https://www.amazon.com/
    yield page.goto('https://www.amazon.com/');
    // Click [aria-label="Search"]
    yield page.locator('[aria-label="Search"]').click();
    // Fill [aria-label="Search"]
    yield page.locator('[aria-label="Search"]').fill('nvidia 3060');
    // Press Enter
    yield Promise.all([
        page.waitForNavigation( /*{ url: 'https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1' }*/),
        page.locator('[aria-label="Search"]').press('Enter')
    ]);
    fetchPage('https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1');
    // Click [aria-label="Search"]
    yield page.locator('[aria-label="Search"]').click();
    // Fill [aria-label="Search"]
    yield page.locator('[aria-label="Search"]').fill('nvidia 3070');
    // Press Enter
    yield Promise.all([
        page.waitForNavigation( /*{ url: 'https://www.amazon.com/s?k=nvidia+3070&crid=E4PRMCDTAGGW&sprefix=nvidia+3070%2Caps%2C64&ref=nb_sb_noss' }*/),
        page.locator('[aria-label="Search"]').press('Enter')
    ]);
    fetchPage('https://www.amazon.com/s?k=nvidia+3070&crid=E4PRMCDTAGGW&sprefix=nvidia+3070%2Caps%2C64&ref=nb_sb_noss');
    // Click [aria-label="Search"]
    yield page.locator('[aria-label="Search"]').click();
    // Fill [aria-label="Search"]
    yield page.locator('[aria-label="Search"]').fill('nvidia 3080');
    // Press Enter
    yield Promise.all([
        page.waitForNavigation( /*{ url: 'https://www.amazon.com/s?k=nvidia+3080&crid=1I9LS6LL4GIYM&sprefix=nvidia+3080%2Caps%2C61&ref=nb_sb_noss' }*/),
        page.locator('[aria-label="Search"]').press('Enter')
    ]);
    fetchPage('https://www.amazon.com/s?k=nvidia+3080&crid=1I9LS6LL4GIYM&sprefix=nvidia+3080%2Caps%2C61&ref=nb_sb_noss');
    // ---------------------
    yield context.close();
    yield browser.close();
    //   //options for csv export package
    //     const options = { 
    //         fieldSeparator: ',',
    //         quoteStrings: '"',
    //         showLabels: true, 
    //         showTitle: true,
    //         title: 'GPU list',
    //         useTextFile: false,
    //         useBom: true,
    //         useKeysAsHeaders: true,
    //         // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    //     };
    //     const csvExporter = new ExportToCsv(options);
    //     csvExporter.generateCsv(cards);
    printCards();
}))();
