import random from "random";
const min = 100001;
const max = 999999;

export const generateCode = (
	min: number = 100000,
	max: number = 999999
): number => {
	return random.int(min, max);
};
