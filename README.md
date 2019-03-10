# Hearthstone Card App

This app is currently in development, but once the MVP is complete, you'll be able to search Hearthstone® cards and filter by class, type, set, and rarity.

## Search Hearthstone Cards

_Progress: Will be implemented soon._

## Add/Update Card Data used by App

Run`node get-card-json` to save card data returned from the HearthstoneJSON API to `data\cards.json`. 

It should be run manually whenever the HeartstoneJSON data is updated, likely soon after there's any kind of change to Hearthstone cards.

## Technologies Used

* JavaScript
* Node.js
* [HearthstoneJSON API](https://hearthstonejson.com/)

## TODO

**MVP:**  
* Implement functionality in `get-card-json.js` to retrieve data from the HearthstoneJSON API and save it to a file.
* Implement Searching cards on the website.
* Implement search result filtering for different options:
  * class
  * type
  * set
  * rarity

Future enhacements may include loading a deck in from a deck code supplied by the game, saving decks and retrieving your saved decks (this would require logging in).  

## License

Code is licensed under the MIT License. 

Note that if you use Blizzard trademarks in association with the code, it's up to you to follow their policies.

## Trademark Info

Hearthstone is a trademark or registered trademark of Blizzard Entertainment, Inc., in the U.S. and/or other countries.
I'm not associated with Blizzard, Inc. but have created this app in accordance to policy in the [Blizzard FAQ](http://us.blizzard.com/en-us/company/about/legal-faq.html). 
