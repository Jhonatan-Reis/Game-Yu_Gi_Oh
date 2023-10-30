const state={
    score:{
        playerScore:0,
        computerScore:0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprite:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions:{
    button: document.getElementById("next-duel"),
    },
}
const pathImg = "/Game-Yu_Gi_Oh/assets/icons/"
const cardData=[
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImg}dragon.png`,
        winOf: [1],
        LoseOf: [2]
    },    
    {
        id:1,
        name: "Dark Magician",
        type: "Stone",
        img: `${pathImg}magician.png`,
        winOf: [2],
        LoseOf: [0]
    },    
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImg}exodia.png`,
        winOf: [0],
        LoseOf: [1]
    }
]
const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}
const musica = document.getElementById("bgm")
musica.play()
async function drawCards(cardNumbers, fieldSide){
    for(let i=0; i <cardNumbers;i++){
        const randomIdCard = await getRandomCard();
        console.log(randomIdCard)
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        console.log(fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}
async function getRandomCard(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
return cardData[randomIndex].id;
}
async function createCardImage(randomIdCard, fieldSide){
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height", "100px")
    cardImage.setAttribute("src", `${pathImg}card-back.png`)
    cardImage.setAttribute("data-id", randomIdCard)
    cardImage.classList.add("card")
    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
        cardImage.addEventListener("mouseover",()=>{
            drawSelectCard(randomIdCard);
        })
    }
    return cardImage;


}
async function drawSelectCard(IdCard){
    state.cardSprite.avatar.src= cardData[IdCard].img;
    state.cardSprite.name.innerText = cardData[IdCard].name;
    state.cardSprite.type.innerText = "Attribute :"+ cardData[IdCard].type;
}
async function setCardsField(Index){
    await removeAllCardsImages();
    let computerCard = await getRandomCard();
    await ShowhiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInField(Index, computerCard)
    let duelResults = await checkDuelResults(Index, computerCard)
   await updateScores();
    await drawbutton(duelResults);
}
async function playAudio(resultado){
    if(resultado != "draw"){
let audio = new Audio(`/Game-Yu_Gi_Oh/assets/audios/${resultado}.wav`)
audio.play()}
}
async function updateScores(){
    state.score.scoreBox.textContent = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`
}
async function drawbutton(text){
    state.actions.button.innerText = text;
    console.log(text)
    state.actions.button.style.display = "block"
}
async function hiddenCardDetails(){
    state.cardSprite.avatar.src = "";
    state.cardSprite.name.innerText = ""
    state.cardSprite.type.innerText = "";
}
async function checkDuelResults(playerCardId,computerCardId){
    let duelResults = "draw"
    let playerCard = cardData[playerCardId]
    let computerCard = cardData[computerCardId]
    if(playerCard.winOf.includes(computerCard.id)){
        duelResults = "win"
        state.score.playerScore++
    } 
    if(playerCard.LoseOf.includes(computerCard.id)){
        duelResults = "lose"
        state.score.computerScore++
    }
    await playAudio(duelResults);
    return duelResults.toUpperCase();
}
async function removeAllCardsImages(){
    let cards = document.querySelector("#computer-cards")
    let imgElement = cards.querySelectorAll("img");
    imgElement.forEach((img)=>img.remove())

    cards = document.querySelector("#player-cards")
    imgElement = cards.querySelectorAll("img");
    imgElement.forEach((img)=>img.remove())
}
async function resetDuel(){
    state.cardSprite.avatar.src="";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display ="none";
    state.fieldCards.computer.style.display ="none";
    init()
}
async function ShowhiddenCardFieldsImages(value){
if(value == true){
    
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
}
if(value == false){
    
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
}
}
async function drawCardsInField(Index, computerCardId){
    state.fieldCards.player.src = cardData[Index].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}
function init()
{
ShowhiddenCardFieldsImages(false);
drawCards(5, playerSides.player1)

drawCards(5, playerSides.computer)
}

init();