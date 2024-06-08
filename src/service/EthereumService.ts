import web3 from '../config/web3';
import { CONTRACT_ADDRESS, BATCH_SIZE, START_BLOCK ,EVENT_TYPE} from '../constants/constants';
import contractAbi from '../abi/Events.json';
import { AbiItem } from 'web3-utils';
import { AppDataSource } from '../config/database';
import { ConditionalOrder } from '../model/ConditionalOrder';
import { Option, none, some, fold } from 'fp-ts/lib/Option';

const { ConditionalOrderPlaced, ConditionalOrderFilled, ConditionalOrderCancelled } = EVENT_TYPE;


export class EthereumService {
    private contractInstance = new web3.eth.Contract(contractAbi as AbiItem[], CONTRACT_ADDRESS);
    private orderRepository = AppDataSource.getRepository(ConditionalOrder);

    async getContractEvents(): Promise<void> {
        try {
            const latestBlock = BigInt(await web3.eth.getBlockNumber());
            const startBlock = BigInt(START_BLOCK);
            const batchSize = BigInt(BATCH_SIZE);

            for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += batchSize) {
                const toBlock = fromBlock + batchSize - BigInt(1) <= latestBlock ? fromBlock + batchSize - BigInt(1) : latestBlock;

                const events = await this.contractInstance.getPastEvents('allEvents', {
                    fromBlock: fromBlock.toString(),
                    toBlock: toBlock.toString()
                });

                for (const event of events) {
                    await this.processEvent(event);
                }
            }
        } catch (error) {
            console.error('Error fetching or processing events:', error);
        }
    }

    private async processEvent(event: any): Promise<void> {
        const { event: eventType, returnValues } = event;

        switch (eventType) {
            case ConditionalOrderPlaced:
                await this.processConditionalOrderPlaced(returnValues);
                break;
            case ConditionalOrderFilled:
                await this.processConditionalOrderFilled(returnValues);
                break;
            case ConditionalOrderCancelled:
                await this.processConditionalOrderCancelled(returnValues);
                break;
            default:
                console.warn(`Unhandled event type: ${eventType}`);
        }
    }

    private async processConditionalOrderPlaced(returnValues: any): Promise<void> {
        const { account, conditionalOrderId, marketKey, marginDelta, sizeDelta, targetPrice, conditionalOrderType, desiredFillPrice, reduceOnly } = returnValues; 
        // Filtering only limit orders
        if(conditionalOrderType === BigInt(0)){
            const newOrder = this.orderRepository.create({
                orderId: conditionalOrderId,
                account,
                marketKey,
                marginDelta,
                sizeDelta,
                targetPrice,
                conditionalOrderType,
                desiredFillPrice,
                reduceOnly,
                readyForExecution: false
            });

            try {
                await this.orderRepository.upsert(newOrder, ['orderId']);
            } catch (error) {
                console.error('Error saving order:', error);
            }
        }
    }

    private async processConditionalOrderFilled(returnValues: any): Promise<void> {
        const { conditionalOrderId, fillPrice, keeperFee, priceOracle } = returnValues;

        const existingOrderOption = await this.findExistingOrder(conditionalOrderId);

        fold(
            () => {},
            async (existingOrder: ConditionalOrder) => {
                existingOrder.fillPrice = fillPrice;
                existingOrder.keeperFee = keeperFee;
                existingOrder.priceOracle = priceOracle;

                try {
                    await this.orderRepository.save(existingOrder);
                    console.log(`Order with orderId ${conditionalOrderId} updated successfully.`);
                } catch (error) {
                    console.error(`Error updating order with orderId ${conditionalOrderId}:`, error);
                }
            }
        )(existingOrderOption);
    }

    private async processConditionalOrderCancelled(returnValues: any): Promise<void> {
        const { conditionalOrderId, reason } = returnValues;

        const existingOrderOption = await this.findExistingOrder(conditionalOrderId);

        fold(
            () => {},
            async (existingOrder: ConditionalOrder) => {
                existingOrder.cancelReason = reason;

                try {
                    await this.orderRepository.save(existingOrder);
                    console.log(`Order with orderId ${conditionalOrderId} updated successfully.`);
                } catch (error) {
                    console.error(`Error updating order with orderId ${conditionalOrderId}:`, error);
                }
            }
        )(existingOrderOption);
    }

    private async findExistingOrder(conditionalOrderId: string): Promise<Option<ConditionalOrder>> {
        try {
            const existingOrder = await this.orderRepository.findOneBy({ orderId: conditionalOrderId });
            return existingOrder ? some(existingOrder) : none;
        } catch (error) {
            console.error(`Error finding order with orderId ${conditionalOrderId}:`, error);
            return none;
        }
    }
}
