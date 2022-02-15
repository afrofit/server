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

export interface ChapterType {
	_id: string;
	actualTargetBodyMoves: number;
	audioUrl: string;
	chapterOrder: number;
	instruction: string;
	name: string;
	storyId: string;
	targetBodyMoves: number;
	targetTimeInMillis: number;
	videoUrl: string;
}

export interface ChapterResponse extends Omit<ChapterType, "_id"> {
	actualTargetBodyMoves: number;
	audioUrl: string;
	bodyMoves: number;
	completed: boolean;
	contentChapterId: string;
	contentChapterName: string;
	contentStoryId: string;
	chapterOrder: number;
	chapterPlayed: string;
	instruction: string;
	started: boolean;
	targetBodyMoves: number;
	targetTimeInMillis: number;
	timeSpentInMillis: number;
	videoUrl: string;
}

export interface StoryResponse {
	completed: boolean;
	contentStoryId: string;
	failVideo?: string;
	finaleVideo?: string;
	started: boolean;
	storyOrderNumber: number;
	storyPlayedId: string;
	successVideo?: string;
	thumb: string;
	title: string;
	totalBodyMoves: number;
	totalUserTimeSpentInMillis: number;
	instruction: string;
	introVideo?: string;
	totalTargetActualBodyMoves: number;
	totalTargetBodyMoves: number;
	totalTargetUserTimeInMillis: number;
}
