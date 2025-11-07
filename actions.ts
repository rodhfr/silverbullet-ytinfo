import { 
    editor, 
    space, 
    system
} from "@silverbulletmd/silverbullet/syscalls";
import {
  VIDEO_THUMBNAIL,
  VIDEO_THUMBNAIL_QUALITY,
  VIDEO_THUMBNAIL_SIZE,
  VIDEO_THUMBNAIL_WRITES,
  VIDEO_TITLE_TAG,
  VIDEO_TITLE_CHAR_SEPARATOR,
  VIDEO_TITLE_ELIPSIS_LIMIT,
  // VIDEO_TITLE_TRUNCATION_FIX,
  VIDEO_TITLE_WRITES,
  WATCHLIST_ENABLE,
  WATCHLIST_PATH
} from "./config.ts";
import {  
    getVideoInfo, 
    expandTemplate, 
    elipsisTitle,
    // fixTruncationIfNeeded
 } from "./parser.ts";
//import { SlashCompletions } from "@silverbulletmd/silverbullet/types";


export async function addToWatchlist() {
  // This function adds a new youtube video to the note

  const ytUrl = await editor.prompt("Enter YouTube URL:", "");
  if (!ytUrl) {
    console.error("fn newWatch(): invalid URL provided, aborting.");
    editor.flashNotification("Invalid URL provided.");
    return;
  } 

  editor.flashNotification(`Adding YouTube video...`);

  const [VideoInfo, apiUrl] = await getVideoInfo(ytUrl);

  if (!VideoInfo) {
    console.error("fn newWatch(): No data received from getVideoInfo().");
    editor.flashNotification("Failed to fetch video info.");
    return;
  }

  // Sanitize for markdown
  let title = VideoInfo.title.replace(/#/g, "\\#"); 
  const author = VideoInfo.author.replace(/#/g, "\\#");
  const description = VideoInfo.description.replace(/#/g, "\\#");

  // This checks and applies elipsis to title if it exceeds limit // disabled by $VIDEO_TITLE_ELIPSIS_LIMIT to 0
  const elipsis_limit = parseInt(VIDEO_TITLE_ELIPSIS_LIMIT);
  title = elipsisTitle(title, elipsis_limit)

  // let adjusted_title = title;
  const titleText = expandTemplate(VIDEO_TITLE_WRITES, {
    title: title,
    url: ytUrl,
    author: author,
    description: description,
    char_separator: VIDEO_TITLE_CHAR_SEPARATOR,
    tag: VIDEO_TITLE_TAG,
  });

  // $VIDEO_TITLE_TRUNCATION_FIX: Workaround image appearing weird in tables
  // if (VIDEO_TITLE_TRUNCATION_FIX) {
  //   console.log(`fn newWatch(): $VIDEO_TITLE_TRUNCATION_FIX = ${VIDEO_TITLE_TRUNCATION_FIX}. Applying truncation fix...`);
  //   adjusted_title = fixTruncationIfNeeded(
  //     title,
  //     author,
  //     char_separator,
  //   );
  // } else {
  //   console.log("fn newWatch(): Truncation fix disabled in config.ts");
  // }

  // --- $VIDEO_THUMBNAIL check ---
  console.log(`$VIDEO_THUMBNAIL = ${VIDEO_THUMBNAIL} in config.ts`);
  if (!VIDEO_THUMBNAIL && !WATCHLIST_ENABLE) {
    console.log("fn newWatch(): VIDEO_THUMBNAIL is false, WATCHLIST_ENABLE false. Skipping thumbnail write and watchlist file write...");
    editor.insertAtCursor(titleText);
    await editor.flashNotification(`🎬 ${author} - ${title} added with sucess!`);
    return;
  }

  console.log(`fn newWatch(): Writing video thumbnail...`);

  // $VIDEO_THUMBNAIL_QUALITY mapping
  const thumbQualityMapping = {
    "high": "maxresdefault",
    "default": "medium",
    "low": "default",
  };

  const thumbQuality = thumbQualityMapping[VIDEO_THUMBNAIL_QUALITY] || "medium";
  console.log(`fn newWatch(): Using thumbnail quality: ${thumbQuality} from Invidious API: ${apiUrl}`);

  const thumbnailArray = VideoInfo.videoThumbnails;
  const thumbnailObj = thumbnailArray.find(item => item.quality === thumbQuality);
  console.log("fn newWatch(): Available thumbnails:", thumbnailArray);

  if (!thumbnailObj) throw new Error(`fn newWatch(): Thumbnail with quality ${thumbQuality} not found.`);
  const thumbUrlPath = thumbnailObj.url;
  const thumbUrl = new URL(thumbUrlPath, apiUrl).href;
  console.log(`fn newWatch(): Selected thumbnail URL: ${thumbUrl}`);

  let size = parseInt(VIDEO_THUMBNAIL_SIZE);
  if (isNaN(size)) {
    console.error("fn newWatch(): Invalid VIDEO_THUMBNAIL_SIZE in config.ts, using default size 300.");
    size = 300;
  }

  const titleThumb = expandTemplate(VIDEO_THUMBNAIL_WRITES, {
    thumbnail: thumbUrl,
    thumbnail_size: size.toString(),
  });

  if (!WATCHLIST_ENABLE) {
    console.log("fn newWatch(): WATCHLIST_ENABLE is false, inserting at cursor...");
    await editor.insertAtCursor(`${titleText}${titleThumb}`);
    await editor.flashNotification(`🎬 ${author} - ${title} added with sucess!`);
    return;
  }

  // --- $WATCHLIST_ENABLE is true ---
  console.log(`fn newWatch(): $WATCHLIST_ENABLE = ${WATCHLIST_ENABLE}, adding to watchlist...`);
  editor.flashNotification("Saving watchlist to " + WATCHLIST_PATH);

  // Does watchlist page exist?
  const page_exists = await space.pageExists(WATCHLIST_PATH);
  if (!page_exists) {
    console.log(`fn newWatch(): Watchlist page does not exist in ${WATCHLIST_PATH}, creating...`);
    const meta = await space.writePage(WATCHLIST_PATH, `${titleText}${titleThumb}`);
    console.log("fn newWatch(): Wrote page metadata:", meta);
    await editor.flashNotification(`🎬 ${author} - ${title} added with sucess!`);
    return;
  }

  // Append to existing watchlist page
  console.log(`fn newWatch(): Watchlist page exists in ${WATCHLIST_PATH}, reading...`);
  const page_content = await space.readPage(WATCHLIST_PATH);
  const meta = await space.writePage(WATCHLIST_PATH, `${page_content}\n${titleText}${titleThumb}`)
  if (meta.created) {
    console.log(`fn newWatch(): Watchlist page created in ${WATCHLIST_PATH}.`);
    editor.flashNotification(`🎬 ${author} - ${title} added with sucess!`);
  }
  else {
    console.log(`fn newWatch(): Some error creating watchlist page in ${WATCHLIST_PATH}.`);
    editor.flashNotification(`new Failed to add ${author} - ${title} to watchlist.`);
  }
}
 

export function delWholeWatchlist() {
  // This function deletes whole watchlist page
  console.log("exec fn deleteWatchlist(): description: Deletes the watchlist page.");
  space.deletePage(WATCHLIST_PATH).then(() => {
    editor.flashNotification(`Watchlist deleted successfully.`);
  }).catch((error) => {
    console.error("fn deleteWatchlist(): Error deleting watchlist.", error);
    editor.flashNotification(`Failed to delete watchlist.`);
  });
} 