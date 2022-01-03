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
export class UserPerformance extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	totalBodyMoves: number;

	@Column()
	totalCaloriesBurned: number;

	@Column()
	totalHoursDanced: number;

	@Column()
	totalDaysActive: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToOne((type) => User, (user) => user.performanceStats)
	@JoinColumn()
	user: User;
}
