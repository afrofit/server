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
exports.Subscription = exports.SubscriptionDuration = exports.SubscriptionName = void 0;
const typeorm_1 = require("typeorm");
const Payment_1 = require("./Payment");
const User_1 = require("./User");
var SubscriptionName;
(function (SubscriptionName) {
    SubscriptionName["TRIAL"] = "trial";
    SubscriptionName["MONTH"] = "monthly";
    SubscriptionName["HALF_YEAR"] = "half-yearly";
    SubscriptionName["YEAR"] = "yearly";
    SubscriptionName["UNSUBSCRIBED"] = "unsubscribed";
})(SubscriptionName = exports.SubscriptionName || (exports.SubscriptionName = {}));
var SubscriptionDuration;
(function (SubscriptionDuration) {
    SubscriptionDuration[SubscriptionDuration["TRIAL"] = 7] = "TRIAL";
    SubscriptionDuration[SubscriptionDuration["MONTH"] = 35] = "MONTH";
    SubscriptionDuration[SubscriptionDuration["HALF_YEAR"] = 185] = "HALF_YEAR";
    SubscriptionDuration[SubscriptionDuration["YEAR"] = 365] = "YEAR";
})(SubscriptionDuration = exports.SubscriptionDuration || (exports.SubscriptionDuration = {}));
let Subscription = class Subscription extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Subscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: SubscriptionName,
        default: SubscriptionName.TRIAL,
    }),
    __metadata("design:type", String)
], Subscription.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: SubscriptionDuration,
        default: SubscriptionDuration.TRIAL,
    }),
    __metadata("design:type", Number)
], Subscription.prototype, "durationInDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isExpired", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", String)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", String)
], Subscription.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)((type) => Payment_1.Payment, (payment) => payment.subscription),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Payment_1.Payment)
], Subscription.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => User_1.User, (user) => user.subscriptions),
    __metadata("design:type", User_1.User)
], Subscription.prototype, "user", void 0);
Subscription = __decorate([
    (0, typeorm_1.Entity)()
], Subscription);
exports.Subscription = Subscription;
