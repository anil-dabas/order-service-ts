import express from 'express';
import bodyParser from 'body-parser';
import orderRouter from './router/OrderRouter';
import { AppDataSource } from './config/database';
import { FetchOrderService } from './service/FetchOrderService';
import { EthereumService } from './service/EthereumService';

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use("/", orderRouter);

AppDataSource.connect().then(async() => {
    const fetchOrderService = new FetchOrderService();
    await fetchOrderService.fetchAndSaveOrders();

    const ethereumService = new EthereumService();
    ethereumService.getContractEvents();
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(error => console.error("TypeORM connection error: ", error));
