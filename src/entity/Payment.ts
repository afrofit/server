import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	OneToOne,
	ManyToOne,
	BaseEntity,
} from "typeorm";
import { Subscription } from "./Subscription";
import { User } from "./User";

@Entity()
export class Payment extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	amountInGBP: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@ManyToOne((type) => User, (user) => user.payments)
	user: User;

	@OneToOne((type) => Subscription, (sub) => sub.payment)
	subscription: Subscription;
}
