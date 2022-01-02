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
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@ManyToOne((type) => User, (user) => user.payments)
	user: User;

	@ManyToOne((type) => Subscription, (sub) => sub.payments)
	subscription: Subscription;
}
