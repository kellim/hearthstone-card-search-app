const cards = require('./utils/cards.js')

cardsData = cards.getCards().then((cardsData) => {
    // Temporary example - filter for legendaries
    const legendaries = cardsData.filter((card) => {
        return card.rarity.toUpperCase() === 'LEGENDARY'
    })
    console.log(legendaries)
}).catch((err) => {
    console.log('Error: ', err)
})
