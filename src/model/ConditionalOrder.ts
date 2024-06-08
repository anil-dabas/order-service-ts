import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ConditionalOrder {
    
    @PrimaryColumn({ type: 'bigint' })
    orderId!: string;

    @Column()
    account!: string;

    @Column()
    marketKey!: string;

    @Column({ type: 'numeric' })
    marginDelta!: string;

    @Column({ type: 'numeric' })
    sizeDelta!: string;

    @Column({ type: 'numeric' })
    targetPrice!: string;

    @Column({ type: 'numeric' })
    conditionalOrderType!: string;

    @Column({ type: 'numeric' })
    desiredFillPrice!: string;

    @Column({ type: 'boolean' })
    reduceOnly!: boolean;

    @Column({ type: 'boolean', default: false })
    readyForExecution!: boolean;

    @Column({ type: 'numeric', nullable: true })
    fillPrice?: string;

    @Column({ type: 'numeric', nullable: true })
    keeperFee?: string;

    @Column({ type: 'numeric', nullable: true })
    priceOracle?: string;

    @Column({ type: 'numeric', nullable: true })
    cancelReason?: string;
}

export default ConditionalOrder;

