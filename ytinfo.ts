import { StringUtils } from "./utils.ts";
import { editor } from "@silverbulletmd/silverbullet/syscalls";
import {
  INVIDIOUS_API_URL,
  VIDEO_THUMBNAIL,
  VIDEO_THUMBNAIL_QUALITY,
  VIDEO_THUMBNAIL_SIZE,
  VIDEO_THUMBNAIL_WRITES,
  VIDEO_TITLE_CHAR_SEPARATOR,
  VIDEO_TITLE_ELIPSIS_LIMIT,
  VIDEO_TITLE_TRUNCATION_FIX,
  VIDEO_TITLE_WRITES,
} from "./config.ts";
//import { SlashCompletions } from "@silverbulletmd/silverbullet/types";

export function getYtID(url: string): string | null {
  console.log(
    "exec fn getYtID(): description: parses youtube video id using regex.",
  );
  const domainRegex = /https?:\/\/(?:www\.)?([^\/]+)/;
  const domainMatch = url.match(domainRegex);
  if (!domainMatch) return null;
  const domain = domainMatch[1].toLowerCase();
  if (!domain.includes("youtube.com") && !domain.includes("youtu.be")) {
    return null;
  }

  // URL: youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([\w-]{11})/);
  if (shortMatch) return shortMatch[1];

  // URL: /watch?v=ID
  const watchMatch = url.match(/[?&]v=([\w-]{11})/);
  if (watchMatch) return watchMatch[1];

  // URL: /shorts/ID
  const shortsMatch = url.match(/\/shorts\/([\w-]{11})/);
  if (shortsMatch) return shortsMatch[1];
  return null;
}

export async function getVideoInfo(url: string) {
  console.log("exec async fn: getVideoInfo(): description: Requests info using invidious api.");
  const ytID = getYtID(url);
  let request_url;
  // check if url has /
  if (INVIDIOUS_API_URL.endsWith("/")) {
    request_url = INVIDIOUS_API_URL + ytID;
  } else {
    request_url = INVIDIOUS_API_URL + "/" + ytID;
  }
  try {
    const response = await fetch(request_url);
    if (!response.ok) {
      throw new Error("fn: getVideoInfo(): Network response error.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fn: getVideoInfo(): Error fetching data.", error);
    return null;
  }
}

export function expandTemplate(template, vars) {
  console.log("exec fn expandTemplate(): description: takes the user provided formatting and uses it.");
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    return vars[key] ?? "";
  });
}

export async function newWatch() {
  const url = await editor.prompt("Enter YouTube URL:", "");
  if (!url) return;
  editor.flashNotification(`Adding YouTube video...`);

  const data = await getVideoInfo(url);
  if (data) {
    const raw_title = data.title;
    const title = raw_title.replace(/#/g, "\\#"); // sanitize for markdown
    const author = data.author;
    const description = data.description;
    const char_separator = VIDEO_TITLE_CHAR_SEPARATOR;

    let adjusted_title = title;

    const elipsis_limit = parseInt(VIDEO_TITLE_ELIPSIS_LIMIT);
    if (elipsis_limit > 3 && title.length > elipsis_limit) {
      adjusted_title = title.substring(0, elipsis_limit - 3) + "...";
      console.log(`fn newWatch(): Title exceeded elipsis limit of ${elipsis_limit} characters. Applied truncation.`);
    }

    // Workaround image appearing weird in tables
    if (VIDEO_TITLE_TRUNCATION_FIX) {
      console.log("fn newWatch(): Applying truncation fix...");
      adjusted_title = StringUtils.fixTruncationIfNeeded(
        title,
        author,
        char_separator,
      );
    } else {
      console.log("fn newWatch(): Truncation fix disabled in config.ts");
    }

    const titleText = expandTemplate(VIDEO_TITLE_WRITES, {
      title: adjusted_title,
      url,
      author,
      description,
      char_separator,
    });

    await editor.insertAtCursor(titleText);

    // Formatting thumbnail
    console.log(`$VIDEO_THUMBNAIL = ${VIDEO_THUMBNAIL} in config.ts`);
    if (VIDEO_THUMBNAIL) {
      console.log(`Writing video thumbnail...`);
      const thumbnail_size = VIDEO_THUMBNAIL_SIZE;
      let thumbnail: string;
      // maybe change this later to search for quality strings instead of index
      if (VIDEO_THUMBNAIL_QUALITY == "default") {
        thumbnail = data.videoThumbnails[4].url;
      } else if (VIDEO_THUMBNAIL_QUALITY == "high") {
        thumbnail = data.videoThumbnails[1].url;
      } else if (VIDEO_THUMBNAIL_QUALITY == "low") {
        thumbnail = data.videoThumbnails[5].url;
      } else {
        thumbnail = data.videoThumbnails[4].url;
      }

      const titleThumb = expandTemplate(VIDEO_THUMBNAIL_WRITES, {
        thumbnail,
        thumbnail_size,
      });

      await editor.insertAtCursor(`${titleThumb}`);

      await editor.flashNotification(`🎬 ${title} added!`);
    } // no data from response:
    else {
      console.log("Failed to fetch video info.");
      await editor.flashNotification("Failed to fetch video info.");
    }
  }
}
