import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Order {
    @PrimaryColumn()
    id!: string;

    @Column()
    account!: string;

    @Column()
    orderType!: string;

    @Column()
    marketKey!: string;

    @Column()
    recordTrade!: string;

    @Column()
    feesPaid!: number;
}
