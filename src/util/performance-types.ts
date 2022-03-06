export type VerifyActivityData = {
	caloriesBurned: number;
	bodyMoves: number;
	totalTimeDancedInMilliseconds: number;
	chapterStarted: boolean;
	chapterCompleted: boolean;
	storyStarted: boolean;
	storyCompleted: boolean;
	contentStoryId: string;
	contentChapterId: string;
};

export type VerifyDailyActivityData = {
	caloriesBurned: number;
	bodyMoves: number;
};

export type VerifyPerformanceData = {
	caloriesBurned: number;
	bodyMoves: number;
	totalTimeDancedInMilliseconds: number;
};

export type VerifyContentPlayedData = {
	caloriesBurned: number;
	bodyMoves: number;
	totalTimeDancedInMilliseconds: number;
	chapterStarted: boolean;
	chapterCompleted: boolean;
	storyStarted: boolean;
	storyCompleted: boolean;
	contentStoryId: string;
	contentChapterId: string;
	chapterOrderNumber: number;
};

export type VerifyResetContentData = {
	contentStoryId: string;
};

export type VerifyMarathonData = {
	bodyMoves: number;
	marathonId?: string;
	userMarathonScoreId: string;
};
