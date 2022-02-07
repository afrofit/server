"use strict";
try {
    const existingPayment = await Payment.findOne({
        where: {
            userId: user.id,
            isActive: true,
        },
    });
    const newSubscription = await Subscription.create({
        userId: user.id,
        durationInDays: calculateSubscriptionDuration(subscriptionData),
        endDate: END_DATE,
        name: subscriptionData,
    }).save();
    const existingSubscriptionList = await Subscription.find({
        where: { userId: user.id },
        order: { createdAt: "DESC" }
    });
    const existingSubscription = existingSubscriptionList.length ? existingSubscriptionList[0] : null;
    if (existingSubscription && new Date(existingSubscription.endDate) < TODAY) {
        let existingPayment, existingjoinSubPayTable;
        existingjoinSubPayTable = await SubscriptionPayment.findOne({
            where: { userId: user.id, subscriptionId: existingSubscription.id }
        });
        const existingPaymentList = await Payment.find({
            where: { userId: user.id },
            order: { createdAt: "DESC" }
        });
        existingPayment = existingPaymentList.length && existingPaymentList[0];
        if (!existingjoinSubPayTable) {
            await SubscriptionPayment.create({
                userId: user.id,
                paymentId: "",
                subscriptionId: existingSubscription.id,
            }).save();
        }
        // const existingPayment = joinSubPayTable ? await Payment.findOne({
        // 	where: {userId: user.id, id: joinSubPayTable.paymentId}
        // }) : null;
        if (new Date(existingSubscription.endDate) < TODAY) {
            existingSubscription.isExpired = true;
            await existingSubscription.save();
            if (existingPayment) {
                existingPayment.isActive = false;
                await existingPayment.save();
            }
        }
        else if (new Date(existingSubscription.endDate) > TODAY) {
            const response = {
                isExpired: existingSubscription.isExpired,
                id: existingSubscription.id,
                userId: user.id,
                name: existingSubscription.name,
                durationInDays: existingSubscription.durationInDays,
                startDate: existingSubscription.createdAt,
                endDate: existingSubscription.endDate,
                existingSubscription: true,
            };
            return res.status(200).send(response);
        }
    }
    else { }
    if (existingSubscription &&
        new Date(existingSubscription.endDate) < TODAY) {
        existingPayment.isActive = false;
        existingSubscription.isExpired = true;
        await existingPayment.save();
        await existingSubscription.save();
    }
    else if (existingPayment &&
        existingSubscription &&
        new Date(existingSubscription.endDate) > TODAY) {
        const response = {
            paymentId: existingPayment.id,
            isExpired: existingSubscription.isExpired,
            id: existingSubscription.id,
            userId: user.id,
            amountInGBP: existingPayment.amountInGBP,
            name: existingSubscription.name,
            durationInDays: existingSubscription.durationInDays,
            startDate: existingSubscription.createdAt,
            endDate: existingSubscription.endDate,
            existingSubscription: true,
        };
        return res.status(200).send(response);
    }
    let newPayment, newSubscription;
    newPayment = await Payment.create({
        userId: user.id,
        amountInGBP: calculatePrices(subscriptionData),
    }).save();
    newSubscription = await Subscription.create({
        userId: user.id,
        durationInDays: calculateSubscriptionDuration(subscriptionData),
        endDate: END_DATE,
        name: subscriptionData,
    }).save();
    await SubscriptionPayment.create({
        userId: user.id,
        paymentId: newPayment.id,
        subscriptionId: newSubscription.id,
    }).save();
    const response = {
        paymentId: newPayment.id,
        isExpired: newSubscription.isExpired,
        id: newSubscription.id,
        userId: user.id,
        amountInGBP: newPayment.amountInGBP,
        name: newSubscription.name,
        durationInDays: newSubscription.durationInDays,
        startDate: newSubscription.createdAt,
        endDate: newSubscription.endDate,
        existingSubscription: false,
    };
    console.log("New Payment", newPayment, newSubscription);
    return res.status(200).send(response);
}
catch (error) {
    console.error(error);
}
return res.send({});
