import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	BeforeInsert,
} from "typeorm";
import { Payment } from "./Payment";
import { StoryChapterPlayed } from "./StoryChapterPlayed";
import { StoryPlayed } from "./StoryPlayed";
import { Subscription } from "./Subscription";
import { UserAchievement } from "./UserAchievement";
import { UserActivityToday } from "./UserActivityToday";
import { UserPerformance } from "./UserPerformance";

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("text", { unique: true })
	email: string;

	@Column()
	password: string;

	@Column("text", { unique: true })
	username: string;

	@Column("int", { nullable: true })
	code: number;

	@Column("int", { nullable: true })
	rankId: number;

	@Column({ nullable: true })
	pushNotificationToken: string;

	@Column({ default: false })
	isPremium: boolean;

	@Column({ nullable: true })
	isPremiumUntil: Date;

	@Column({ default: false })
	isVerified: boolean;

	@Column({ default: false })
	isRegistered: boolean;

	@Column({ default: false })
	isReactivated: boolean;

	@Column({ default: false })
	isAdmin: boolean;

	@CreateDateColumn()
	createdAt: string;

	@UpdateDateColumn()
	updatedAt: string;

	// RELATIONS

	@OneToOne(
		() => UserPerformance,
		(userPerformance: UserPerformance) => userPerformance.user
	)
	performanceStats: UserPerformance;

	@OneToOne(
		() => UserActivityToday,
		(activity: UserActivityToday) => activity.user
	)
	activityToday: UserActivityToday;

	@OneToOne(() => Subscription, (sub: Subscription) => sub.user)
	subscription: Subscription;

	@OneToMany((type) => StoryPlayed, (storyPlayed) => storyPlayed.user)
	storiesPlayed: StoryPlayed[];

	@OneToMany(
		(type) => StoryChapterPlayed,
		(chapterPlayed) => chapterPlayed.user
	)
	storyChaptersPlayed: StoryChapterPlayed[];

	@OneToMany((type) => Payment, (payment) => payment.user)
	payments: Payment[];

	@OneToMany(
		(type) => UserAchievement,
		(userAchievement) => userAchievement.user
	)
	achievements: UserAchievement[];

	// FUNCTIONS

	hashPassword(password: string = ""): Promise<string> {
		return argon2.hash(password);
	}

	verifyPassword(
		hashedPassword: string,
		suppliedPassword: string
	): Promise<boolean> {
		return argon2.verify(hashedPassword, suppliedPassword);
	}

	generateToken(): string {
		const token = jwt.sign(
			{
				id: this.id,
				email: this.email,
				isPremium: this.isPremium,
				isVerified: this.isVerified,
				isPremiumUntil: this.isPremiumUntil,
				isAdmin: this.isAdmin,
				isRegistered: this.isRegistered,
				username: this.username,
				joinDate: this.createdAt,
				rankId: this.rankId,
			},
			process.env.TOKEN_SECRET!
		);
		return token;
	}

	generateResetToken(): string {
		const resetToken = jwt.sign(
			{
				id: this.id,
				email: this.email,
				isReactivated: this.isReactivated,
				reactivationDate: this.updatedAt,
			},
			process.env.RESET_TOKEN_SECRET!
		);
		return resetToken;
	}

	@BeforeInsert()
	async savePassword(): Promise<void> {
		if (this.password) {
			const hashedPassword = await this.hashPassword(this.password);
			this.password = hashedPassword;
		}
	}
}
