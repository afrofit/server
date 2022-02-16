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
const date_fns_1 = require("date-fns");
const typeorm_1 = require("typeorm");
let UserActivityToday = class UserActivityToday extends typeorm_1.BaseEntity {
    setDates() {
        this.dayStartTime = (0, date_fns_1.startOfToday)();
        this.dayEndTime = (0, date_fns_1.endOfToday)();
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserActivityToday.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "double precision", default: 0 }),
    __metadata("design:type", Number)
], UserActivityToday.prototype, "caloriesBurned", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserActivityToday.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], UserActivityToday.prototype, "bodyMoves", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserActivityToday.prototype, "dayStartTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserActivityToday.prototype, "dayEndTime", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], UserActivityToday.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], UserActivityToday.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserActivityToday.prototype, "setDates", null);
UserActivityToday = __decorate([
    (0, typeorm_1.Entity)()
], UserActivityToday);
exports.UserActivityToday = UserActivityToday;
