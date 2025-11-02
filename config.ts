export const INVIDIOUS_API_URL = "https://inv.perditum.com/api/v1/videos/"; // you can change to your preference or leave it default.
export const VIDEO_THUMBNAIL = true;  // false disables it.
export const VIDEO_THUMBNAIL_SIZE = "300"; // in px. 0 to max size.
export const VIDEO_TITLE_WRITES = "- [ ] [${title}](${url}) #watch "; // this the how the video title will be writed
export const VIDEO_THUMBNAIL_WRITES = "![thumbnail|${thumbnail_size}](${thumbnail})\n";

// available ytinfos: title, url, description, thumbnail.
// some of them are only available in their respective variables like thumbnail.
// eventually gonna make this more flexible and less error prone alpha feature for now.

