// --- 
// CONFIGURATION FILE FOR SILVERBULLET YTINFO PLUGIN

// Invidious API URL to fetch video information.
// You can change to your preferences or leave it default.
// Default: "https://inv.perditum.com/api/v1/videos/"
// List of public instances: https://api.invidious.io/
export const INVIDIOUS_API_URL = "https://inv.perditum.com/api/v1/videos/"; 

export const WATCHLIST_ENABLE = true;
export const WATCHLIST_PATH = "WATCHLIST";

// Enable/Disable writing thumbnail.
// Available: true, false. 
// Default: true
export const VIDEO_THUMBNAIL = true;  

// Thumbnail size in pixels.
// 0 to max size.
// Default: 300
export const VIDEO_THUMBNAIL_SIZE = "300"; 

// Thumbnail quality setting.
// Available: high, default, low. 
// Default is better for page loading using public invidious instances and the image quality is decent. 
// High is better on selfhosted invidious instance. Page loading, may appear slow. 
// Low for limited bandwidth e.g. mobile data. On low the thumbnail may appear pixelated and with black borders.
export const VIDEO_THUMBNAIL_QUALITY = "default" 

// Enable/Disable truncation fix with formatting dots. 
// It applies only if title + author length is between 48 and 84 or 112 and 150 characters. This includes VIDEO_TITLE_CHAR_SEPARATOR.
// There's a table issue in silverbullet where images appear weirdly in the object query if the text length is within that range.
// Default: true
// export const VIDEO_TITLE_TRUNCATION_FIX = false; 

// Number of characters before forcing truncation also known as title elipsis "...".
// Set to 0 to disable automatic truncation.
// Minimum of 4 for truncation to make sense. Otherwise, it will be ignored.
// Default: "0" // Disabled
export const VIDEO_TITLE_ELIPSIS_LIMIT = "44"; 

// ---
// ADVANCED USERS ONLY: Customize how the video title and thumbnail will be written in silverbullet upon calling the ytinfo function.
// This will be worked on in future updates to allow more customization and make it more easier to configure.
// if you change the formatting here, make sure to keep the variable names intact.

// Example: "- [ ] Vsauce - What is random? #watch"
// Example thumbnail: "![thumbnail|300](https://i.ytimg.com/vi/VIDEO_ID/hqdeftault.jpg)"

// char separator can be anything you like, e.g. " - ", " | ", ": ", " ~ ", etc.
export const VIDEO_TITLE_CHAR_SEPARATOR = " - "; 
export const VIDEO_TITLE_TAG = "#watch";
// available variables: ${title}, ${url}, ${author}, ${description}
export const VIDEO_TITLE_WRITES = "- [ ] [${author}${char_separator}${title}](${url}) ${tag}"; 
// available variables: ${thumbnail}, ${thumbnail_size}.
// \n is used to create new lines.
export const VIDEO_THUMBNAIL_WRITES = "\n![thumbnail|${thumbnail_size}](${thumbnail})\n"; 
