import { editor } from "@silverbulletmd/silverbullet/syscalls";

export async function newWatch() {
  const url = await editor.prompt("Enter YouTube URL:", "");
  if (!url) return;

  const match = url.match(/v=([\w-]{11})/);
  if (!match) {
    await editor.flashNotification("Invalid YouTube URL");
    return;
  }

  const ytID = match[1];
  const api = `https://inv.perditum.com/api/v1/videos/${ytID}`;

  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    const title = data.title ?? "Unknown title";
    await editor.insertAtCursor(`- [ ] [${title}](${url}) #watch\n`);
    await editor.flashNotification(`🎬 ${title} added!`);
  } catch (err) {
    console.error(err);
    await editor.flashNotification("Failed to fetch video info");
  }
}
