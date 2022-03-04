import argon2 from "argon2";
import jwt from "jsonwebtoken";
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	BaseEntity,
	BeforeInsert,
} from "typeorm";

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

	@Column("int", { default: 1 })
	rankId: number;

	@Column({ nullable: true })
	pushNotificationToken: string;

	@Column({ default: false })
	isVerified: boolean;

	@Column({ default: true })
	hasTrial: boolean;

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
				isVerified: this.isVerified,
				isAdmin: this.isAdmin,
				isRegistered: this.isRegistered,
				username: this.username,
				joinDate: this.createdAt,
				rankId: this.rankId,
				hasTrial: this.hasTrial,
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
