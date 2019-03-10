const fs = require('fs')
const path = require('path')

const getCardsData = () => {
    return new Promise((resolve, reject) => {
        const cardsFilePath = path.join(__dirname, '../../data/cards.json')
        fs.readFile(cardsFilePath, 'utf8', (err, cards) => {
            if (err) return reject(err)
            resolve(cards)
        })
   })
}

const getCards = async () => {
    const cards = await getCardsData()
    return JSON.parse(cards)
}


module.exports = {
    getCards
}