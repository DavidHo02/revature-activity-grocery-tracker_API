const Item = require('./item');
const fs = require('fs');
const path = require('path');
const { logger } = require('./util/logger');

// path to data file
const filePath = path.join(__dirname, 'data.json');

function readGroceryListData() {
    // if data.json does not exist
    if(!fs.existsSync(filePath)) {
        // create data.json with an empty list
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function writeGroceryListData() {
    fs.writeFileSync('data.json', JSON.stringify(groceryList), null, 2);
    logger.info('Grocery list updated in data.json');
}

groceryList = readGroceryListData();

function addItem(name, quantity, price, bought) {
    newItem = new Item(
        name, 
        quantity, 
        parseFloat(price).toFixed(2), 
        bought
    );
    groceryList.push(newItem);
    logger.info(`Added ${newItem.name} to grocery list`);
    writeGroceryListData();
}

function togglePurchased(itemName) {
    let index = searchItem(itemName);
    if(index === -1) { // could not find item in groceryList

    }
    else { // did find the item in grocery_list, now change old values to new values
        groceryList.at(index).bought = !groceryList.at(index).bought;
        logger.info(`Set ${itemName}'s bought status as ${groceryList.at(index).bought} in the grocery list`);
    }
    writeGroceryListData();
}

function deleteItem(itemName) {
    let index = searchItem(itemName);
    if(index === -1) { // could not find item in grocery_list

    }
    else { // did find the item in grocery_list, now remove it
        groceryList.splice(index, 1)
        logger.info(`Deleted ${itemName} from grocery list`);
    }
    writeGroceryListData();
}

function searchItem(itemName) {
    return groceryList.findIndex((item) => item.name == itemName);
}

module.exports = {
    groceryList,
    addItem,
    togglePurchased,
    deleteItem,
}

