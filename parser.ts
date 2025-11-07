import {
  INVIDIOUS_API_URL,
} from "./config.ts";

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
  console.log(
    "exec async fn: getVideoInfo(): description: Requests info using invidious api.",
  );
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
  console.log(
    "exec fn expandTemplate(): description: takes the user provided formatting and uses it.",
  );
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    return vars[key] ?? "";
  });
}

export function elipsisTitle(title: string, limit: number): string {
  console.log("exec fn elipsisTitle(): description: truncates title if it exceeds limit.");
  if (title.length > limit && limit > 3) {
    console.log(`fn elipsisTitle(): Title exceeded elipsis limit of ${limit} characters. Applied truncation.`)
    return title.substring(0, limit - 3) + "...";
  }
  return title;
}

export function fixTruncationIfNeeded(
  title: string,
  author: string,
  char_separator: string,
): string {
  const video_namestring_len = title.length + author.length +
    char_separator.length;
  let adjusted_title = title;

  if (
    video_namestring_len > 47 && video_namestring_len < 84 ||
    video_namestring_len > 112 && video_namestring_len < 150
  ) {
    const formatting_spaces = ".".repeat(35);
    adjusted_title = adjusted_title.concat(formatting_spaces);
  }

  return adjusted_title;
}
