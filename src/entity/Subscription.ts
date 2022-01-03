import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	BaseEntity,
	JoinColumn,
	OneToOne,
} from "typeorm";
import { Payment } from "./Payment";
import { User } from "./User";

export enum SubscriptionName {
	TRIAL = "7-Day Trial",
	MONTH = "Monthly",
	HALF_YEAR = "Half-Yearly",
	YEAR = "Yearly",
}

export enum SubscriptionDuration {
	TRIAL = 7,
	MONTH = 35,
	HALF_YEAR = 185,
	YEAR = 365,
}

@Entity()
export class Subscription extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	// Could be one of "7-Day Trial", "Month", Half-Year, Year
	@Column({
		type: "enum",
		enum: SubscriptionName,
		default: SubscriptionName.TRIAL,
	})
	name: string;

	// Could be one of 7 (free trial), 35, 185, 365
	@Column({
		type: "enum",
		enum: SubscriptionDuration,
		default: SubscriptionDuration.TRIAL,
	})
	durationInDays: number;

	@Column()
	amountinGBP: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToMany((type) => Payment, (payment) => payment.subscription)
	payments: Payment[];

	@OneToOne((type) => User, (user) => user.performanceStats)
	@JoinColumn()
	user: User;
}
