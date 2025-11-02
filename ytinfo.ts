import { editor } from "@silverbulletmd/silverbullet/syscalls";
import { INVIDIOUS_API_URL, 
         VIDEO_TITLE_WRITES,
         VIDEO_THUMBNAIL, 
         VIDEO_THUMBNAIL_SIZE,
         VIDEO_THUMBNAIL_WRITES
} from "./config.ts";
import { SlashCompletions } from "@silverbulletmd/silverbullet/types";

export function getYtID(url: string): string | null {
  console.log("getYtID()")
	const domainregex= /https?:\/\/([^\/]+)/;
	const domainmatch = url.match(domainregex);
	if (!domainmatch || !domainmatch[1].includes("youtube.com")) {
		return null;
	}
	const idregex = /v=([\w-]{11})/;
	const match = url.match(idregex);
	if (!match) {
		return null;
	}
	return match[1];
}

export async function getVideoInfo(url: string) {
  console.log("getVideoInfo()")
	const ytID = getYtID(url);
//	const request_url = INVIDIOUS_API_URL + ytID;
  const request_url = INVIDIOUS_API_URL.endsWith('/') 
    ? INVIDIOUS_API_URL + ytID 
    : INVIDIOUS_API_URL + '/' + ytID;
	try {
		const response = await fetch(request_url);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
}

export function expandTemplate(template, vars) {
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
    const title = raw_title.replace(/#/g, "\\#"); // sanitize
    const title_len = title.length;
    const author = data.author;
    const description = data.description;
    //await editor.insertAtCursor(`- [ ] [${title}](${url}) #watch `);
    const titleText = expandTemplate(VIDEO_TITLE_WRITES, { title, url });
    await editor.insertAtCursor(titleText);
    //await editor.insertAtCursor(VIDEO_TITLE_WRITES)
    console.log(`$VIDEO_THUMBNAIL = ${VIDEO_THUMBNAIL} in config.ts`);
    if (VIDEO_THUMBNAIL) {
      console.log(`Writing thumbnail...`);
      const thumbnail_size = VIDEO_THUMBNAIL_SIZE;
      const thumbnail = data.videoThumbnails[0].url; 
      //await editor.insertAtCursor(`![thumbnail|${VIDEO_THUMBNAIL_SIZE}](${thumbnail})\n`);
      const titleThumb = expandTemplate(VIDEO_THUMBNAIL_WRITES, { thumbnail, thumbnail_size });
      if (title_len > 46 && title_len < 64) {
        console.log(`$title len: ${title_len} fixing with $formatting_spaces`);
        const formatting_spaces = " ".repeat(29);
        console.log(formatting_spaces);
        console.log(`$formatting_spaces: ${formatting_spaces.length}`);
        await editor.insertAtCursor(`${formatting_spaces}${titleThumb}`); 
      }
      else {
        console.log(`$title len: ${title_len} does not need format fix.`);
        await editor.insertAtCursor(titleThumb); 
      }
    }
    await editor.flashNotification(`🎬 ${title} added!`);
  } 
  else {
    await editor.flashNotification("Failed to fetch video info");
  }
}
