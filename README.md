# Project Template 2020

This is my (as of 2020) project setup for a website with a separate frontend
repository.

## Setup

### CodeKit (macOS)

CodeKit should pick up all settings from the `config.codekit3` 


### Prepros (Windows/Linux)

If you're on Windows you should be able to use the [Prepros][PRE] app for
compiling the assets. A `.config` file is already present, which should set
everything up for you, almost as if you were using CodeKit on a Mac.

You cannot, however, use the *Live Preview* function, as it doesn't (yet?) have
the ability to set the "root" folder for the site, and you'll need that since
you're building everything into the `build` folder.

If you're using Visual Studio Code as your editor, you can use the
**Live Server** extension and configure it to use the `build` folder as root:

(This goes into your Workspace's `.vscode/settings.json` file).

```json
{
	"liveServer.settings.root": "project-template.Frontend/build"
}
```

**Note:** `project-template` should be replaced with the actual project/folder
name.







[PRE]: https://prepros.io/
