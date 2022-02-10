"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FETCH_STORY_QUERY = (storyId) => {
    return `*[_type=="story" && _id=="${storyId}"]{
        _id,
        description,
        title,
        storyOrderNumber,
        instruction,
        "introVideo": introVideo.url,
        "thumb": thumbnail.asset->url,
      }`;
};
const FETCH_CHAPTER_QUERY = (chapterId) => {
    return `*[_type=="chapter && _id="${chapterId}"]{
        ...
    }`;
};
const FETCH_STORY_CHAPTERS_QUERY = (storyId) => {
    return `*[_type=="chapter && _id="${storyId}"]{
        ...
    }`;
};
const FETCH_STORIES_QUERY = () => {
    return `*[_type=="story"]{_id, title, storyOrderNumber, "thumb": thumbnail.asset->url} | order(storyOrderNumber asc)`;
};
exports.default = {
    FETCH_STORIES_QUERY,
    FETCH_STORY_QUERY,
    FETCH_CHAPTER_QUERY,
    FETCH_STORY_CHAPTERS_QUERY,
};
