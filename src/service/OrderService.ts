import { AppDataSource } from '../config/database';
import { Order } from '../model/Order';
import { ConditionalOrder } from '../model/ConditionalOrder';

export class OrderService {
    private orderRepository = AppDataSource.getRepository(Order);
    private conditionalOrderRepository = AppDataSource.getRepository(ConditionalOrder); 

    // Methods for Orders
    
    async getAllOrders(): Promise<Order[]> {
        return this.orderRepository.find();
    }

    async saveOrder(orderData: Partial<Order>): Promise<Order> {
        const newOrder = this.orderRepository.create(orderData);
        return this.orderRepository.save(newOrder);
    }

    async getFilteredOrders(filters: any): Promise<Order[]> {
        return this.orderRepository.findBy(filters);
    }

    // Methods for ConditionalOrders

    async getAllConditionalOrders(): Promise<ConditionalOrder[]> {
        return this.conditionalOrderRepository.find();
    }

    async saveConditionalOrder(orderData: Partial<ConditionalOrder>): Promise<ConditionalOrder> {
        const newConditionalOrder = this.conditionalOrderRepository.create(orderData);
        return this.conditionalOrderRepository.save(newConditionalOrder);
    }

    async getFilteredConditionalOrders(filters: any): Promise<ConditionalOrder[]> {
        return this.conditionalOrderRepository.findBy(filters);
    }
}
