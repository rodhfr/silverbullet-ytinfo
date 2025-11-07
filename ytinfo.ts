import { system } from "@silverbulletmd/silverbullet/syscalls";
import { 
  addToWatchlist,
  delWholeWatchlist
} from "./actions.ts";

export async function newWatch() {
  await addToWatchlist();
  system.invokeCommand("System: Reload");
}

export async function deleteWatch() {
  await delWholeWatchlist();
  system.invokeCommand("System: Reload");
}