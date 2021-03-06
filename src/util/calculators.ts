export const calculateSubscriptionDuration = (name: String): number => {
	if (name === "trial") return 7;
	else if (name === "monthly") return 35;
	else if (name === "half-yearly") return 185;
	else if (name === "yearly") return 365;
	return 0;
};

export const calculatePrices = (name: String): number => {
	if (name === "trial") return 0;
	else if (name === "monthly") return 180;
	else if (name === "half-yearly") return 360;
	else if (name === "yearly") return 2000;
	else if (name == "unsubscribed") return 0;
	return 0;
};

export const calculateSubscriptionEndDate = (
	startDate: string,
	duration: number
): Date => {
	const date: Date = new Date(startDate);
	const result: number = date.setDate(date.getDate() + duration);
	return new Date(result);
};

export const calculateDayStart = (): { [key: string]: number } => {
	const date = new Date();
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	return {
		month: date.getMonth(),
		day: date.getDay(),
		year: date.getFullYear(),
		fullDate: date.getDate(),
	};
};

export const calculateWeekStart = (currentDate: Date) => {
	// What's the month, year and day of currentDate?
	// The start of the week is always Sunday = 0;
	// So if today is not 0, then look for the day before that day that is of zero
	// locate that day by getting the real date
};
