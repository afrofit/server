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
	ManyToOne,
} from "typeorm";
import { Payment } from "./Payment";
import { User } from "./User";

export enum SubscriptionName {
	TRIAL = "trial",
	MONTH = "monthly",
	HALF_YEAR = "half-yearly",
	YEAR = "yearly",
	UNSUBSCRIBED = "unsubscribed",
}

export enum SubscriptionDuration {
	TRIAL = 7,
	MONTH = 35,
	HALF_YEAR = 185,
	YEAR = 365,
}

@Entity()
export class Subscription extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

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

	@Column({ default: false })
	isExpired: boolean;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToOne((type) => Payment, (payment) => payment.subscription)
	@JoinColumn()
	payment: Payment;

	@ManyToOne((type) => User, (user) => user.subscriptions)
	user: User;
}
