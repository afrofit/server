import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	BaseEntity,
} from "typeorm";
import { Award } from "./Award";
import { User } from "./User";

@Entity()
export class UserAchievement extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@ManyToOne((type) => User, (user) => user.achievements)
	user: User;

	@ManyToOne((type) => Award, (award) => award.userAchievements)
	award: Award;
}
