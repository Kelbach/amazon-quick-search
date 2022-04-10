"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
function fetchPage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        //cheerio boilerplate that I found
        try {
            const response = yield axios_1.default.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const cards = [];
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
                let newCard = {
                    name: name,
                    price: price,
                    url: itemUrl,
                    currentDate: currentDate
                };
                cards.push(newCard);
            });
            return cards;
        }
        catch (error) {
            throw error;
        }
    });
}
fetchPage('https://www.amazon.com/s?k=nvidia+3060&crid=2WB9L4PJER3CU&sprefix=nvidia+3060%2Caps%2C66&ref=nb_sb_noss_1').then((cards) => console.log(cards));
