
document.querySelector("#deal").addEventListener("click", drawHand);
let playerCards = document.querySelectorAll(".playerHand");
let houseCards = document.querySelectorAll(".houseHand");
let modal = document.querySelector('.modal');
let overlay = document.querySelector('.overlay');
let deckID = '';
let score = 0;
let remainingCards = 0;
let playerHand = [];
let houseHand = [];
let targetScore = 33;

document.querySelector('#openModal').addEventListener('click', openModal);
document.querySelector('#closeModal').addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);


playerCards.forEach((card, i)=> {
    card.addEventListener('click', () => {
        playCard(i);
        housePlay();
    });
});

function openModal() {
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function drawHand() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(res => res.json())
        .then(data => {
            console.log(data);
            deckID = data.deck_id;
            for(let i = 0; i < playerCards.length; i++) {
                drawCard(i, 'player');
                drawCard(i, 'house');
            }
        })
        .catch(err => {
            console.log(`error ${err}`);
    });
}

function drawCard(n, hand) {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`)
    .then(res => res.json())
    .then(data => {
        remainingCards = data.remaining;
        document.querySelector("#remain").innerHTML = remainingCards;
        if (hand === 'player') playerCards[n].src = data.cards[0].image;
        else houseCards[n].src = data.cards[0].image;
        data.cards[0].point = setPoint(data.cards[0]);
        if (hand === 'player') playerHand[n] = data.cards[0];
        else houseHand[n] = data.cards[0];
    })
}

function setPoint(card) {
    let sign = 1;
    if(card.suit == 'HEARTS' || card.suit == 'DIAMONDS') sign = -1;

    const face = ['JACK', 'QUEEN', 'KING', 'ACE'];
    const faceVal = [11, 12, 13, 1];

    if(Number(card.value) > 0) {
        return Number(card.value) * sign;
    } else {
        return faceVal[face.indexOf(card.value)] * sign;
    }
}

function playCard(n) {
    if(remainingCards > 0) {
        score += playerHand[n].point;
        document.querySelector("#score").innerHTML = score;
        drawCard(n, 'player');
    }
}

function housePlay() {
    let n = Math.floor(Math.random() * 4);
    if(remainingCards > 0) {
        console.log(houseHand[n])
        score += houseHand[n].point;
        document.querySelector("#score").innerHTML = score;
        drawCard(n, 'house');
    }
    console.log(remainingCards);
    checkEnd();
}

function checkEnd() {
    if(score === targetScore) {
        window.alert("You Win!");
        location.reload();
    }else if (score === -targetScore) {
        window.alert("You lose!");
        location.reload();
    }else if (remainingCards === 0) {
        if((score > 0 && score < targetScore) || score < -targetScore){
            window.alert("You Win!");
        } else if ((score < 0 && score > -targetScore) || score > targetScore){
            window.alert("You lose!");
        }
        location.reload();
    }
}