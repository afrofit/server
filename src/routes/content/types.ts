export interface StoryType {
	_id: string;
	description: string;
	failVideo?: string;
	finaleVideo?: string;
	introVideo?: string;
	storyOrderNumber: number;
	successVideo?: string;
	thumb: string;
	title: string;
	totalTargetActualBodyMoves: number;
	totalTargetBodyMoves: number;
	totalTargetUserTimeInMillis: number;
}

export interface StoryResponse extends Omit<StoryType, "_id" | "description"> {
	completed: boolean;
	contentStoryId: string;
	started: boolean;
	storyPlayedId: string;
	totalBodyMoves: number;
	totalUserTimeSpentInMillis: number;
	instruction: string;
	introVideo?: string;
}

export interface ChapterType {
	_id: string;
	actualTargetBodyMoves: number;
	audioUrl: string;
	chapterOrder: number;
	instruction: string;
	name: string;
	storyId: string;
	contentStoryId: string;
	targetBodyMoves: number;
	targetTimeInMillis: number;
	videoUrl: string;
}

export interface ChapterResponse
	extends Omit<ChapterType, "_id" | "storyId" | "name"> {
	bodyMoves: number;
	completed: boolean;
	contentChapterId: string;
	contentChapterName: string;
	chapterPlayed: string;
	instruction: string;
	started: boolean;
	timeSpentInMillis: number;
}
