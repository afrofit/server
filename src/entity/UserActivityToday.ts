import { endOfToday, startOfToday } from "date-fns";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	BeforeInsert,
} from "typeorm";

@Entity()
export class UserActivityToday extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "double precision", default: 0 })
	caloriesBurned: number;

	@Column()
	userId: string;

	@Column({ default: 0 })
	bodyMoves: number;

	@Column()
	dayStartTime: Date;

	@Column()
	dayEndTime: Date;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@BeforeInsert()
	setDates(): void {
		this.dayStartTime = startOfToday();
		this.dayEndTime = endOfToday();
	}
}
