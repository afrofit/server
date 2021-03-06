const FETCH_STORY_QUERY = (storyId: string) => {
	return `*[_type=="story" && _id=="${storyId}"]{
        _id,
        description,
        title,
        storyOrderNumber,
        instruction,
        "introVideo": introVideo.url,
        "thumb": thumbnail.asset->url,
        "slug": slug.current,
        totalTargetUserTimeInMillis,
        totalTargetActualBodyMoves,
        totalTargetBodyMoves,
        "failVideo": chapterFailVideo.url,
        "successVideo": chapterSuccessVideo.url,
        "storyFinishVideo": storyFinishVideo.url,
        storySuccessText

      }`;
};

const FETCH_CHAPTER_QUERY = (chapterId: string) => {
	return `*[_type=="chapter" && _id=="${chapterId}"]{
                _id,
                actualTargetBodyMoves,
               "audioUrl":audioInstruction.url,
                chapterOrder,
                instruction,
                name,
                "videoUrl": video.url,
                targetTimeInMillis,
                targetBodyMoves,
                storyId
    }`;
};

const FETCH_STORY_CHAPTERS_QUERY = (storyId: string) => {
	return `*[_type=="chapter" && storyId==${storyId}]{
        "audioUrl":audioInstruction.url,
       _id,
       "videoUrl": video.url,
       targetBodyMoves,
       name,
       instruction,
       chapterOrder,
       storyId,    
       targetTimeInMillis,
       actualTargetBodyMoves
       } | order(chapterOrder desc)`;
};

const FETCH_STORIES_QUERY = () => {
	return `*[_type=="story"]{
        _id,
        description,
        title,
        storyOrderNumber,
        instruction,
        "introVideo": introVideo.url,
        "thumb": thumbnail.asset->url,
        "slug": slug.current,
        totalTargetUserTimeInMillis,
        totalTargetActualBodyMoves,
        "failVideo": chapterFailVideo.url,
        "successVideo": chapterSuccessVideo.url,
        "storyFinishVideo": storyFinishVideo.url,
        totalTargetBodyMoves,
        storySuccessText
        } | order(storyOrderNumber asc)`;
};

export default {
	FETCH_STORIES_QUERY,
	FETCH_STORY_QUERY,
	FETCH_CHAPTER_QUERY,
	FETCH_STORY_CHAPTERS_QUERY,
};
