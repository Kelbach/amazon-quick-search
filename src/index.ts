// importing cheerio, a node package that turns HTML into an api call
const cheerio = require("cheerio");
const axios = require("axios");
const { chromium } = require('playwright');
const fs = require('fs');
import { ExportToCsv } from 'export-to-csv';

interface Card {
    name: string;
    price: number;
    url: string;
    currentDate: string;
}

// interface CardList {
//     id: number;
//     price: number;
// }

const cards: Card[] = [];  

// const cardlist: CardList[] = [];
// let AUrl: string = (new URL(document.location)).searchParams;

async function fetchPage(searched:string, url: string) {
  //cheerio boilerplate that I found
  try {
      let temp = <Card[]>[];
      
      const response = await axios.get(url, {
        headers: {
        Accept: "application/json",
        "User-Agent": "axios 6.14.15"
      }});
      const html = response.data;
      const $ = cheerio.load(html);
      
      //this string in the query selector seems to cover each item
      //querySelect EVERYTHHING
      $('div.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16').each((_idx:any, el:any) => {
        const card = $(el);
        //find everything
        const name = card.find('span.a-size-medium.a-color-base.a-text-normal').text();
        
        const itemUrl = card.find('a.a-link-normal.a-text-normal').attr('href');
        // const priceWhole = card.find('a-price-whole').text();
        // const priceFraction = card.find('a-price-fraction').text();
        const price = card.find('span.a-price-whole').text();
        const currentDate = new Date().toLocaleDateString();
        //validation
        if (name.includes(searched) && price != '') {
          let newCard: Card = {
              name: name,
              price: price,
              url: 'amazon.com'+itemUrl,
              currentDate: currentDate
          };
          temp.push(newCard);  
        }  
      });
      //sorts  and then small loop for top 3
      temp.sort((a: any,b: any) => (a.price) - (b.price));
      for (let i:number = 0; i < 3; i++) {
        //no SSDs allowed
        if (temp[i].name.includes('Crucial')) { 
          temp.splice(i,1);
          i--;
        } else {
        cards.push(temp[i]);
        }
      }
      return cards;
  } catch (error) {
      throw error;
  }
}

// //might have to change data type here
// function filterCards(name: string) {
  
//   for (var i = 0; i < cards.length; i++){
    
//       if (cards[i].name.includes(name)) {
        
//       }
//   }
// }

// //cant find the right data type for 'err'
function printCards() {
    let csv = cards.map(element => {
        return Object.values(element).map(item => `"${item}"`).join(',')
    }).join("\n")
    
    fs.writeFile('saved-cards.csv', "Name, Price, URL, Date" + '\n' + csv, 'utf8', function (err: any)
        {
            if (err) throw err;
            console.log('complete');
        }
    )
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


(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to https://www.amazon.com/
  await page.goto('https://www.amazon.com/');

  // Click [aria-label="Search"]
  await page.locator('[aria-label="Search"]').click();

  // Fill [aria-label="Search"]
  await page.locator('[aria-label="Search"]').fill('nvidia 3060');

  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1' }*/),
    page.locator('[aria-label="Search"]').press('Enter')
  ]);


    await fetchPage('3060','https://www.amazon.com/s?k=nvidia+3060&crid=1FMSFWKKZUAY&sprefix=nvidia+3060%2Caps%2C69&ref=nb_sb_noss_1');
    

  // Click [aria-label="Search"]
  await page.locator('[aria-label="Search"]').click();

  // Fill [aria-label="Search"]
  await page.locator('[aria-label="Search"]').fill('nvidia 3070');

  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://www.amazon.com/s?k=nvidia+3070&crid=E4PRMCDTAGGW&sprefix=nvidia+3070%2Caps%2C64&ref=nb_sb_noss' }*/),
    page.locator('[aria-label="Search"]').press('Enter')
  ]);

    await fetchPage('3070','https://www.amazon.com/s?k=nvidia+3070&crid=VYS35PCOAW9F&sprefix=nvidia+3070%2Caps%2C63&ref=nb_sb_noss');

  // Click [aria-label="Search"]
  await page.locator('[aria-label="Search"]').click();

  // Fill [aria-label="Search"]
  await page.locator('[aria-label="Search"]').fill('nvidia 3080');

  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://www.amazon.com/s?k=nvidia+3080&crid=1I9LS6LL4GIYM&sprefix=nvidia+3080%2Caps%2C61&ref=nb_sb_noss' }*/),
    page.locator('[aria-label="Search"]').press('Enter')
  ]);

    await fetchPage('3080','https://www.amazon.com/s?k=nvidia+3080&crid=1I9LS6LL4GIYM&sprefix=nvidia+3080%2Caps%2C61&ref=nb_sb_noss');
    // .then(cards => 
    //   console.log(cards)
    // );

  // ---------------------
  await context.close();
  await browser.close();


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
    console.log(cards);
    printCards();
})();