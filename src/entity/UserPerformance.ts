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
import { Rank } from "./Rank";
import { User } from "./User";

@Entity()
export class UserPerformance extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	totalDanceSteps: number;

	@Column()
	totalTimeSpent: number;

	@Column()
	storiesCompleted: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToOne((type) => User, (user) => user.performanceStats)
	@JoinColumn()
	user: User;
}
