import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";

@Entity()
export class StoryChapterPlayed extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	contentId: string;

	@Column()
	userId: string;

	@Column()
	storyId: string;

	@Column()
	bodyMoves: number;

	@Column({ default: false })
	completed: boolean;

	@Column({ default: 0 })
	userTimeSpentInMillis: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
