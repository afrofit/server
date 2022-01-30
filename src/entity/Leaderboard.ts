import { endOfWeek, startOfWeek } from "date-fns";
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

@Entity()
export class Leaderboard extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	endDate: Date;

	@Column()
	startDate: Date;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@BeforeInsert()
	calculateEndDate(): void {
		this.endDate = endOfWeek(new Date());
		this.startDate = startOfWeek(new Date());
	}
}
