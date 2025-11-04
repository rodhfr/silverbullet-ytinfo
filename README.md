# SilverBullet YTinfo
Get and write metadata like title, author and description from YouTube videos using Invidious API.

<img src="https://raw.githubusercontent.com/rodhfr/silverbullet-ytinfo/refs/heads/main/resources/scrsht.png" width="1000">


## Installation
### Silverbullet v2 (required)
Add `"ghr:rodhfr/silverbullet-ytinfo/ytinfo.plug.js"` to your plugin list in CONFIG page:

```lua 
config.set {
  plugs = {
    "ghr:rodhfr/silverbullet-ytinfo/ytinfo.plug.js"
  }
}
```
if you have more than one plugin you need to separate them with "," as this is an array.
```
    "ghr:rodhfr/silverbullet-ytinfo/ytinfo.plug.js",
    "ghr:user/someotherplugin/plugin.plug.js"
```

Run `Plugs: Update`
Update hotkey is `cmd+shift+p` or launch `cmd + /` then search for Plugs Update.

## Usage
`cmd + /` for the launcher and search `Youtube: New Watch` it will prompt for the YouTube link.

### Create video watchlist using #watch tags.
Write this code into your page and is possible to search for all instances of videos in watchlist.

```lua
${template.each(query[[
from index.tag "watch"
order by ref
where not _.done
limit 30
]], templates.taskItem)}
```

### Using objects query in template pages
`${"$"}` prevents variables to expand in the template. With this you can dinamically add your watchlist to your daily page for example.
```
* # WATCHLIST 🎬
${"$"}{template.each(query[[
from index.tag "watch"
order by ref
where not _.done
limit 30
]], templates.taskItem)}
```

## Customize 
### Slashcommands define
You can create your own slashcommands using the addon's builtin functions like `Youtube: New Watch`.
```lua
slashCommand.define {
  name = "newvideo",
  run = function()
    editor.invokeCommand("Youtube: New Watch")
  end
}
```

## Build
To build this plug, make sure you have [Deno installed](https://docs.deno.com/runtime/). Then, build the plug with:

```shell
deno task build
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js /my/space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug, just watch your browser's JavaScript console to see when this happens.

### Manual Installation
Copy `ytinfo.plug.js` to silverbullet/_plugs/ and wait for it to autoupdate, it doesn't need to manually run `Plugs: Update`. Running `Plugs: Update` erases the `ytinfo.plug.js`.

## Functions
* `Youtube: New Watch`: requests video information from invidious server using youtube video id then write hyperlinked video title and optionally thumbnail with #watch tag.
