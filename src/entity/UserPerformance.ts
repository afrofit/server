import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
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
	userId: string;

	@Column({ default: 0 })
	totalBodyMoves: number;

	@Column({ type: "double precision", default: 0 })
	totalCaloriesBurned: number;

	@Column({ default: 0 })
	totalTimeDancedInMilliseconds: number;

	@Column({ default: 0 })
	totalDaysActive: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
