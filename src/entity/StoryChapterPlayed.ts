import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	OneToOne,
	JoinColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
} from "typeorm";
import { StoryChapter } from "./StoryChapter";
import { User } from "./User";

@Entity()
export class StoryChapterPlayed extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@OneToOne((type) => StoryChapter)
	@JoinColumn()
	storyChapter: StoryChapter;

	@Column()
	userDanceSteps: number;

	@Column({ default: false })
	completed: boolean;

	@Column({ default: 0 })
	userTimeSpentInMillis: number;

	@ManyToOne((type) => User, (user) => user.storyChaptersPlayed)
	user: User;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
