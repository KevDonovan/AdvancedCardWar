
document.querySelector("button").addEventListener("click", drawHand);
let playerCards = document.querySelectorAll(".playerHand");
let houseCards = document.querySelectorAll(".houseHand");
let deckID = '';
let score = 0;
let remainingcards = 1;

class Hand {
    constructor(card1, card2, card3, card4) {
        this.cards = [card1, card2, card3, card4];
    }

    setCard(card, i) {
        this.cards[i] = card;
    }
}

let playerHand = new Hand(null, null, null, null);
let houseHand = new Hand(null, null, null, null);

playerCards.forEach((cardImg, i) => {
    cardImg.addEventListener("click", () => selectCard(i));
})

fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(res => res.json())
    .then(data => {
        deckID = data.deck_id;
        drawHand();
    })

function drawHand(){
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=8`)
    .then(res => res.json())
    .then(data => {
        remainingcards = data.remaining;
        data.cards.forEach((card, i) => {
            card.point = getPoint(card.suit, card.value)
            if(i < 4) {
                playerCards[i].src = card.image;
                playerHand.setCard(card, i);
            } else {
                houseCards[i - 4].src = card.image;
                houseHand.setCard(card, i - 4);
            }
        })
    })
}

function getPoint(suit, value) {
    let sign = 1;
    if(suit == 'HEARTS' || suit == 'DIAMONDS') sign = -1;

    const face = ['JACK', 'QUEEN', 'KING', 'ACE'];
    const faceVal = [11, 12, 13, 1];

    if(Number(value) > 0) {
        return Number(value) * sign;
    } else {
        return faceVal[face.indexOf(value)] * sign;
    }

}

function selectCard(card) {
    if (remainingcards > 0) {
        housePlay();
        score += playerHand.cards[card].point;
        if(score === 42) window.alert("You Win!");
        else if (score > 42 ) window.alert("You Lose!");
        document.querySelector("#score").innerHTML = score;
        drawCard(card);
    }
}

function drawCard(n) {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(res => res.json())
    .then(data => {
        remainingcards = data.remaining;
        card = data.cards[0];
        card.point = getPoint(card.suit, card.value);
        playerHand.setCard(card, n)
        playerHand[n] = card;
        playerCards[n].src = card.image;
        console.log(data);
    })
}

function housePlay() {
    let houseCard = Math.floor(Math.random() * 4);
    console.log(houseCard);
    score += houseHand.cards[houseCard].point;
    //if(score === 42) window.alert("You Win!");
    //else if (score > 42 ) window.alert("You Lose!");
    //document.querySelector("#score").innerHTML = score;
    houseDraw(houseCard);
}

function houseDraw(n) {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(res => res.json())
    .then(data => {
        remainingcards = data.remaining;
        card = data.cards[0];
        card.point = getPoint(card.suit, card.value);
        houseHand.setCard(card, n)
        houseHand[n] = card;
        houseCards[n].src = card.image;
        console.log(data);
    })
}