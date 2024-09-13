const Item = require('./item');
const fs = require('fs');

const grocery_list = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

let name = 'david';
function showGroceryList() {
    console.log(`${name}'s grocery list:`);
    grocery_list.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} ${item.quantity} ($${item.price}) ${item.bought}`);
    });
}

function updateGroceryListData() {
    fs.writeFileSync('data.json', JSON.stringify(grocery_list), 'utf8', (err) => {
        if(err) {
            return;
        }
    });
}

function addItem(name, quantity, price, bought) {
    newItem = new Item(name, quantity, price, bought);
    grocery_list.push(newItem);
    updateGroceryListData();
}

function editItem(name, quantity, price, bought) {
    let index = searchItem(name);
    if(index === -1) { // could not find item in grocery_list

    }
    else { // did find the item in grocery_list, now change old values to new values
        grocery_list.at(index).name = name;
        grocery_list.at(index).quantity = quantity;
        grocery_list.at(index).price = price;
        grocery_list.at(index).bought = bought;
    }
    updateGroceryListData();
}

function deleteItem(itemName) {
    let index = searchItem(itemName);
    if(index === -1) { // could not find item in grocery_list

    }
    else { // did find the item in grocery_list, now remove it
        grocery_list.splice(index, 1)
    }
    updateGroceryListData();
}

function searchItem(itemName) {
    return grocery_list.findIndex((item) => item.name == itemName);
}

module.exports = {
    grocery_list,
    addItem,
    editItem,
    deleteItem,
}

