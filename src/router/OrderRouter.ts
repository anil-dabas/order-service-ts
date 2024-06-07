import express, { Request, Response } from 'express';
import { OrderService } from '../service/OrderService';

const router = express.Router();
const ordersRouter = express.Router();
const orderService = new OrderService();

ordersRouter.get('/subgraph', async (req: Request, res: Response) => {
    const { account, marketKey } = req.query;
    const filters: any = {};
    if (account) filters.account = account;
    if (marketKey) filters.marketKey = marketKey;
    const orders = await orderService.getFilteredOrders(filters);
    res.json(orders);
});

ordersRouter.get('/chain', async (req: Request, res: Response) => {
    const { account, marketKey } = req.query;
    const filters: any = {};
    if (account) filters.account = account;
    if (marketKey) filters.marketKey = marketKey;
    const conditionalOrders = await orderService.getFilteredConditionalOrders(filters);
    res.json(conditionalOrders);
});

router.use('/orders', ordersRouter);

export default router;