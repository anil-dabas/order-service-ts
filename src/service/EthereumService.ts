import web3 from '../config/web3';
import { CONTRACT_ADDRESS, BATCH_SIZE, START_BLOCK } from '../constants/constants';
import contractAbi from '../abi/Events.json';
import { AbiItem } from 'web3-utils';
import { AppDataSource } from '../config/database';
import { ConditionalOrder } from '../model/ConditionalOrder';
import { eventNames } from 'process';
const abi = require('web3-eth-abi'); // Import web3-eth-abi package

export class EthereumService {
    private contractInstance = new web3.eth.Contract(contractAbi as AbiItem[], CONTRACT_ADDRESS);
    private orderRepository = AppDataSource.getRepository(ConditionalOrder);

    async getContractEvents(): Promise<void> {
        try {
            const latestBlock = BigInt(await web3.eth.getBlockNumber());
            const startBlock = BigInt(START_BLOCK);
            const batchSize = BigInt(BATCH_SIZE);

            const eventSignatures = [
                abi.encodeEventSignature('ConditionalOrderPlaced(address,uint256,bytes32,int256,int256,uint256,uint8,uint256,bool)'),
                abi.encodeEventSignature('ConditionalOrderPlaced(address,uint256,bytes32,int256,int256,uint256,uint8,uint256,bool)'),
                abi.encodeEventSignature('ConditionalOrderCancelled(address,uint256,uint8)'),
                abi.encodeEventSignature('ConditionalOrderCancelled(address,uint256,bytes32,uint8)'),
                abi.encodeEventSignature('ConditionalOrderFilled(address,uint256,uint256,uint256)'),
                abi.encodeEventSignature('ConditionalOrderFilled(address,uint256,bytes32,uint256,uint256)'),
                abi.encodeEventSignature('ConditionalOrderFilled(address,uint256,bytes32,uint256,uint256,uint8)')
            ];
    
            for (let fromBlock = startBlock; fromBlock <= latestBlock; fromBlock += batchSize) {
                const toBlock = fromBlock + batchSize - BigInt(1) <= latestBlock ? fromBlock + batchSize - BigInt(1) : latestBlock;
               // console.log(`Fetching events for ${eventSignatures} from block ${fromBlock.toString()} to ${toBlock.toString()}`);

                const events = await this.contractInstance.getPastEvents('allEvents', {
                    fromBlock: fromBlock.toString(),
                    toBlock: toBlock.toString(),
                    filter: {
                        event: 'ConditionalOrderPlaced'
                    }
                });

                for (const event of events) {
                    // Process each event here
                    console.log(event);
                }
            }
        
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }
}
