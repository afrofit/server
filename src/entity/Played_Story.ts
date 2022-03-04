import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";

@Entity()
export class PlayedStory extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	contentStoryId: string;

	@Column({ default: 0 })
	totalBodyMoves: number;

	@Column({ default: 0 })
	oldTotalBodyMoves: number;

	@Column({ default: 0 })
	totalUserTimeSpentInMillis: number;

	@Column({ default: false })
	completed: boolean;

	@Column({ default: false })
	started: boolean;

	@Column({ default: 0 })
	lastChapterCompleted: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
