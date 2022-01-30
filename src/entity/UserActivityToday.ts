import { endOfToday, startOfToday } from "date-fns";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	BeforeInsert,
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserActivityToday extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ default: 0 })
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

	@OneToOne((type) => User, (user) => user.activityToday)
	@JoinColumn()
	user: User;

	@BeforeInsert()
	setDates(): void {
		this.dayStartTime = startOfToday();
		this.dayEndTime = endOfToday();
	}
}
