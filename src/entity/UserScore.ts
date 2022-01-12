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
export class UserScore extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	score: number;

	@Column()
	bodyMoves: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
