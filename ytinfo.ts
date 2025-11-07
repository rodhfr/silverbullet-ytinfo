import { 
  sleep 
} from "./utils.ts";
import { 
  editor 
} from "@silverbulletmd/silverbullet/syscalls";
import { 
  addToWatchlist,
  delWholeWatchlist
} from "./actions.ts";

export async function newWatch() {
  await addToWatchlist();
  await sleep(3);
  await editor.reloadPage();
}

export async function deleteWatch() {
  await delWholeWatchlist();
  await sleep(3);
  await editor.reloadPage();
}