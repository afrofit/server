import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";

@Entity()
export class PlayedChapter extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	contentChapterId: string;

	@Column()
	contentStoryId: string;

	@Column()
	playedStoryId: string;

	@Column({ default: 0 })
	bodyMoves: number;

	@Column({ default: false })
	completed: boolean;

	@Column({ default: false })
	started: boolean;

	@Column({ default: 0 })
	timeSpentInMillis: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
