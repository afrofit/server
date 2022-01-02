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
import { Story } from "./Story";
import { User } from "./User";

@Entity()
export class StoryPlayed extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@OneToOne((type) => Story)
	@JoinColumn()
	story: Story;

	@Column({ default: false })
	completed: boolean;

	@ManyToOne((type) => User, (user) => user.storiesPlayed)
	user: User;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;
}
