import { PlayedChapter } from "../../entity/Played_Chapter";
import { PlayedStory } from "../../entity/Played_Story";
import {
	ChapterResponse,
	ChapterType,
	StoryResponse,
	StoryType,
} from "./types";

export const mapStoryResponse = (
	story: StoryType,
	performance: PlayedStory
): StoryResponse => {
	return {
		contentStoryId: story._id,
		title: story.title,
		storyOrderNumber: story.storyOrderNumber,
		thumb: story.thumb,
		introVideo: story.introVideo,
		instruction: story.description,
		totalTargetUserTimeInMillis: story.totalTargetUserTimeInMillis,
		totalTargetActualBodyMoves: story.totalTargetActualBodyMoves,
		totalTargetBodyMoves: story.totalTargetBodyMoves,
		storySuccessText: story.storySuccessText,
		totalBodyMoves: performance.totalBodyMoves,
		totalUserTimeSpentInMillis: performance.totalUserTimeSpentInMillis,
		completed: performance.completed,
		started: performance.started,
		storyPlayedId: performance.id,
		failVideo: story.failVideo,
		successVideo: story.successVideo,
		storyFinishVideo: story.storyFinishVideo,
	};
};

export const mapChapterResponse = (
	chapter: ChapterType,
	performance: PlayedChapter
): ChapterResponse => {
	return {
		contentChapterId: chapter._id,
		contentChapterName: chapter.name,
		audioUrl: chapter.audioUrl,
		videoUrl: chapter.videoUrl,
		targetBodyMoves: chapter.targetBodyMoves,
		chapterOrder: chapter.chapterOrder,
		instruction: chapter.instruction,
		actualTargetBodyMoves: chapter.actualTargetBodyMoves,
		targetTimeInMillis: chapter.targetTimeInMillis,
		contentStoryId: performance.contentStoryId,
		chapterPlayed: performance.id,
		completed: performance.completed,
		started: performance.started,
		timeSpentInMillis: performance.timeSpentInMillis,
		bodyMoves: performance.bodyMoves,
	};
};
