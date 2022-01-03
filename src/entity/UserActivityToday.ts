import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserActivityToday extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	caloriesBurned: number;

	@Column()
	bodyMoves: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToOne((type) => User, (user) => user.activityToday)
	@JoinColumn()
	user: User;
}
