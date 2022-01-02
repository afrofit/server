import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	BaseEntity,
} from "typeorm";
import { UserAchievement } from "./UserAchievement";

@Entity()
export class Award extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	imageUrl: string;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	@OneToMany(
		(type) => UserAchievement,
		(userAchievement) => userAchievement.user
	)
	userAchievements: UserAchievement[];
}
