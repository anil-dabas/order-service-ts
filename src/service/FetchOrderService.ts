import axios from 'axios';
import { SUBGRAPH_URL, SMART_MARGIN_ORDERS_QUERY } from '../constants/constants';
import { AppDataSource } from '../config/database';
import { Order } from '../model/Order';

export class FetchOrderService {
    private orderRepository = AppDataSource.getRepository(Order);

    async fetchAndSaveOrders(): Promise<void> {
        try {
            const response = await axios.post(SUBGRAPH_URL, { query: SMART_MARGIN_ORDERS_QUERY });
            const orders = response.data.data.smartMarginOrders;

            for (const order of orders) {
                const newOrder = this.orderRepository.create({
                    id: order.id,
                    account: order.account,
                    orderType: order.orderType,
                    marketKey: order.marketKey,
                    recordTrade: order.recordTrade,
                    feesPaid: order.feesPaid
                });
                await this.orderRepository.save(newOrder);
            }
        } catch (error) {
            console.error('Error fetching or saving orders:', error);
        }
    }
}
