const http = require('http');
const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { grocery_list, addItem, editItem, deleteItem } = require('./grocery_list');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({filename: 'app.log'})
    ]
});

const PORT = 3000;
const server = http.createServer((req, res) => {
    logger.info(`[${req.method} ${req.url}]`);

    res.setHeader('Content-Type', 'application/json');

    let body = '';
    switch(req.method) {
        case('GET'): // view the grocery list
            res.statusCode = 200;
            logger.info(`Response body: ${grocery_list}`);
            res.end(
                JSON.stringify({
                    grocery_list
                })
            );
            break;
        case('POST'): // add an item
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                if(!body) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({message: 'Error: No item found'}));
                }
                else {
                    let item = JSON.parse(body);
                    addItem(item.name, item.quantity, item.price, item.bought);
                    logger.info(`Added ${item.name} to grocery list`);
                    res.statusCode = 201;
                    res.end(JSON.stringify({message: `Success: Added ${item.name} to grocery list`}));
                }
            });
            break;
        case('PUT'): // edit an item
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                if(!body) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({message: 'Error: No item found'}));
                }
                else {
                    let item = JSON.parse(body);
                    editItem(item.name, item.quantity, item.price, item.bought);
                    logger.info(`Edited ${item.name} in grocery list`);
                    res.statusCode = 200;
                    res.end(JSON.stringify({message: `Success: Edited ${item.name} in grocery list`}));
                }
            });
            break;
        case('DELETE'): // delete an item
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', () => {
                if(!body) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({message: 'Error: No item found'}));
                }
                else {
                    let itemName = JSON.parse(body).name;
                    deleteItem(itemName);
                    logger.info(`Deleted ${itemName} from grocery list`);
                    res.statusCode = 202;
                    res.end(JSON.stringify({message: "DELETE request handled"}));
                }
            });
            break;
        default:
            res.statusCode = 405;
            res.end(JSON.stringify({message: 'Method not supported'}));
    }
});

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});