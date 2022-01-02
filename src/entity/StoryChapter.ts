import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";
import { Story } from "./Story";

@Entity()
export class StoryChapter extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	introVideo: string;

	@Column()
	successVideo: string;

	@Column()
	failVideo: string;

	@Column()
	chapterOrderPOS: number;

	@Column()
	targetDanceSteps: number;

	@Column()
	allotedTimeInMillis: number;

	@ManyToOne((type) => Story, (story) => story.chapters)
	story: Story;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
