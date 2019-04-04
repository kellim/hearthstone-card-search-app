// This module saves data returned from the HearthstoneJSON API to 
// src/data/cards.json. It should be run manually whenever the HeartstoneJSON 
// data is updated, likely soon after there's any kind of change to Hearthstone card(s)
// including after new expansions come out.

const fs = require('fs')
const path = require('path')
const axios = require('axios')

// This API doesn't require a key, and you can only retrieve all the cards at once. 
const cardUrl = 'https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json'
const dataDir = path.join(__dirname, '../../data')

 // Get card data from HearthstoneJSON API
axios.get(cardUrl).then((response) => {
  saveCardData(JSON.stringify(response.data))
})

// save cards data to data/cards.json
const saveCardData = (cards) => {
  fs.writeFile(`${dataDir}/cards.json`, cards, (err) => {
    if (err) {
      console.log(err.message)
      return
    }
    console.log('Card data has been saved!')
  })
}