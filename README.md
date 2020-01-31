# Project Template 2020

This is our (as of 2020) project setup for a website with a separate frontend
repository.

## Directory Setup

The `src` folder is structured basically to have a folder for each filetype:

```text
src
 ├── js
 ├── kit
 ├── less
 ├ - - - - - - - -
 ├── assets
 ├── previewmedia
 ├ - - - - - - - -
 ├── components
 ├── panels
 └── layouts
```

### js, kit & less

These are regular source files (JavaScript, HTML & CSS) that compile into the
`build/assets` folder, side by side.


### assets & previewmedia

These hold images, icons & maybe webfonts for use in the site; they should get
copied to the build folder (in `build/assets` and `build/previewmedia`
respectively).

Files in `assets` are for icons, images & fonts, while `previewmedia` is meant
for images that would ideally come from a CMS or similar.

### components, panels & layouts

The `components` folder should contain individual components of the site, like
buttons, cards etc.

Larger elements that wraps a couple (or a list) of elements gets to go into the
`panels` folder.

Full page layouts go into the `layouts` folder.

## Build Setup

### CodeKit (macOS)

CodeKit should pick up all settings from the `config.codekit3`.


### Prepros (Windows/Linux)

If you're on Windows you should be able to use the [Prepros][PRE] app for
compiling the assets. A `.config` file is already present, which should set
everything up for you, almost as if you were using CodeKit on a Mac.

To use it, add the `{project-template}.Frontend` folder as a project in Prepros.

You cannot, however, use the *Live Preview* function, as it doesn't (yet?) have
the ability to set the "root" folder for the site, and you'll need that since
you're building everything into the `build` folder.

If you're using Visual Studio Code as your editor, you can use the
**Live Server** extension and configure it to use the `build` folder as root:

(This goes into your Workspace's `.vscode/settings.json` file).

```json
{
	"liveServer.settings.root": "{project-template}.Frontend/build"
}
```

**Note:** `{project-template}` should be replaced with the actual project/folder
name.







[PRE]: https://prepros.io/
