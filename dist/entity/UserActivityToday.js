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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivityToday = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let UserActivityToday = class UserActivityToday extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserActivityToday.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserActivityToday.prototype, "caloriesBurned", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserActivityToday.prototype, "bodyMoves", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], UserActivityToday.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], UserActivityToday.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)((type) => User_1.User, (user) => user.activityToday),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", User_1.User)
], UserActivityToday.prototype, "user", void 0);
UserActivityToday = __decorate([
    (0, typeorm_1.Entity)()
], UserActivityToday);
exports.UserActivityToday = UserActivityToday;
