import { startOfToday, endOfToday } from "date-fns";
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
export class ActiveDay extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: string;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
