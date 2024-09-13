const http = require('http');
const { logger } = require('./util/logger');
const { groceryList, addItem, togglePurchased, deleteItem } = require('./grocery_list');

const PORT = 3000;
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let body = '';

    req
        .on('data', (chunk) => {
            body += chunk;
        })
        .on('end', () => {
            body = body.length > 0 ? JSON.parse(body) : {};

            let { name, quantity, price, bought } = body;

            if(req.url.startsWith('/items')) {
                let index = parseInt(req.url.split('/')[2]);
            }

            switch(req.method) {
                case 'GET':
                    res.statusCode = 200;
                    res.end(JSON.stringify(groceryList));
                    break;
                case 'POST':
                    addItem(name, quantity, price, bought);
                    res.statusCode = 201;
                    res.end(JSON.stringify(groceryList));
                    break;
                case 'PUT':
                    togglePurchased(name);
                    res.status = 200;
                    res.end(JSON.stringify(groceryList));
                    break;
                case 'DELETE':
                    deleteItem(name);
                    res.status = 202;
                    res.end(JSON.stringify(groceryList));
                    break;
                default:
                    break;
            }
        });
});

server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});