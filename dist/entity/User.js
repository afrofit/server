"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const typeorm_1 = require("typeorm");
const Payment_1 = require("./Payment");
const StoryChapterPlayed_1 = require("./StoryChapterPlayed");
const StoryPlayed_1 = require("./StoryPlayed");
const Subscription_1 = require("./Subscription");
const UserAchievement_1 = require("./UserAchievement");
const UserActivityToday_1 = require("./UserActivityToday");
const UserPerformance_1 = require("./UserPerformance");
let User = class User extends typeorm_1.BaseEntity {
    // FUNCTIONS
    hashPassword(password = "") {
        return argon2_1.default.hash(password);
    }
    verifyPassword(hashedPassword, suppliedPassword) {
        return argon2_1.default.verify(hashedPassword, suppliedPassword);
    }
    generateToken() {
        const token = jsonwebtoken_1.default.sign({
            id: this.id,
            email: this.email,
            isPremium: this.isPremium,
            hasTrial: this.hasTrial,
            isTrial: this.isTrial,
            isTrialUntil: this.isTrialUntil,
            isVerified: this.isVerified,
            isPremiumUntil: this.isPremiumUntil,
            isAdmin: this.isAdmin,
            isRegistered: this.isRegistered,
            username: this.username,
            joinDate: this.createdAt,
            rankId: this.rankId,
        }, process.env.TOKEN_SECRET);
        return token;
    }
    generateResetToken() {
        const resetToken = jsonwebtoken_1.default.sign({
            id: this.id,
            email: this.email,
            isReactivated: this.isReactivated,
            reactivationDate: this.updatedAt,
        }, process.env.RESET_TOKEN_SECRET);
        return resetToken;
    }
    savePassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.password) {
                const hashedPassword = yield this.hashPassword(this.password);
                this.password = hashedPassword;
            }
        });
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "rankId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "pushNotificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "hasTrial", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isTrial", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "isTrialUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isPremium", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "isPremiumUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isRegistered", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isReactivated", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserPerformance_1.UserPerformance, (userPerformance) => userPerformance.user),
    __metadata("design:type", UserPerformance_1.UserPerformance)
], User.prototype, "performanceStats", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => UserActivityToday_1.UserActivityToday, (activity) => activity.user),
    __metadata("design:type", UserActivityToday_1.UserActivityToday)
], User.prototype, "activityToday", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => StoryPlayed_1.StoryPlayed, (storyPlayed) => storyPlayed.user),
    __metadata("design:type", Array)
], User.prototype, "storiesPlayed", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => StoryChapterPlayed_1.StoryChapterPlayed, (chapterPlayed) => chapterPlayed.user),
    __metadata("design:type", Array)
], User.prototype, "storyChaptersPlayed", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => Payment_1.Payment, (payment) => payment.user),
    __metadata("design:type", Array)
], User.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Subscription_1.Subscription, (sub) => sub.user),
    __metadata("design:type", Array)
], User.prototype, "subscriptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => UserAchievement_1.UserAchievement, (userAchievement) => userAchievement.user),
    __metadata("design:type", Array)
], User.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "savePassword", null);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
