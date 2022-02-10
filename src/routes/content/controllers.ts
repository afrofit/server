import { PlayedChapter } from "../../entity/Played_Chapter";
import { PlayedStory } from "../../entity/Played_Story";
import { User } from "../../entity/User";

const getStoriesPlayed = async (user: User) => {
	const storiesPlayed = await PlayedStory.find({
		userId: user.id,
	});

	if (!storiesPlayed || !storiesPlayed.length) {
		return null;
	}

	return storiesPlayed;
};
const getChaptersplayed = async (user: User, storyId: string) => {
	const chaptersPlayed = await PlayedChapter.find({
		userId: user.id,
		playedStoryId: storyId,
	});

	if (!chaptersPlayed || !chaptersPlayed.length) {
		return null;
	}

	return chaptersPlayed;
};

export default { getChaptersplayed, getStoriesPlayed };
