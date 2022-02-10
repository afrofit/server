export type StoryType = {
	_id: string;
	storyOrderNumber: number;
	title: string;
	thumb: string;
	introVideo?: string;
	successVideo?: string;
	failVideo?: string;
	finaleVideo?: string;
	instruction: string;
};

export type ChapterType = {
	_id: string;
	audioUrl: string;
	videoUrl: string;
	chapterOrderNumber: number;
	name: string;
	instruction: string;
	targetBodyMoves: number;
	storyId: string;
};

export type ChapterResponse = {
	contentStoryId: string;
	contentChapterId: string;
	contentChapterName: string;
	audioUrl: string;
	videoUrl: string;
	targetBodyMoves: number;
	chapterOrder: number;
	instruction: string;
	chapterPlayed: string;
	completed: boolean;
	started: boolean;
	timeSpentInMillis: number;
	bodyMoves: number;
};

export type StoryResponse = {
	contentStoryId: string;
	title: string;
	storyOrderNumber: number;
	thumb: string;
	totalBodyMoves: number;
	totalUserTimeSpentInMillis: number;
	completed: boolean;
	started: boolean;
	storyPlayedId: string;
	introVideo?: string;
	successVideo?: string;
	failVideo?: string;
	finaleVideo?: string;
	instruction: string;
};
