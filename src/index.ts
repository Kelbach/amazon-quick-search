interface Card {
    id: number;
    name: string;
    price: number;
    url: string;
    currentDate: string;
}

interface CardList {
    id: number;
    price: number;
}

const cards: Card[] = [];
const cardlist: CardList[] = [];

function findLowestPrice() {
    for (let i=0; i<30; i++) {
        // data-index at i

        //if data-asin null or a-link-normal does not include card name then skip

        //else push data-index and query select and push a-price-whole + a-price-fraction/100
    }

    //arrange CardList low to high

    //query select first three by data-index, collect
}