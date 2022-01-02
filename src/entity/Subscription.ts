import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	BaseEntity,
} from "typeorm";
import { Payment } from "./Payment";

@Entity()
export class Subscription extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// Could be one of "Month", Half-Year, Year
	@Column()
	name: string;

	// Could be one of 35, 185, 365
	@Column()
	durationInDays: number;

	@Column()
	amountinGBP: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToMany((type) => Payment, (payment) => payment.subscription)
	payments: Payment[];
}
