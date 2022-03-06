import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	// OneToOne,
	// JoinColumn,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";
// import { User } from "./User";

@Entity()
export class UserMarathonScore extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	marathonId: string;

	@Column({ default: 0 })
	bodyMoves: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
