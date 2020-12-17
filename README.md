---
Project Name: Project Template 2020
Project Alias: project-template
Project Desc: This is our (as of 2020) project setup for a website with a separate frontend repository.
---


# [%Project Name]

[%Project Desc]

## Directory Setup

The `src` folder is structured like this:

```text
src
 ├── js
 ├── less
 ├ - - - - - - - -
 ├── kit
 ├ - - - - - - - -
 ├── assets
 ├── previewmedia
 ├ - - - - - - - -
 ├── components
 ├── panels
 └── layouts
```

### js & less

These are regular source files that compile into the
`build/assets` folder as `.js` & `.css` files, side by side.

### kit

The files in here are [Kit files][KIT] which compile to regular HTML files in
the `build` folder, maintaining their file structure, e.g.:


| Source file                   | Build file                   |
|-------------------------------|------------------------------|
| src/kit/**index**.kit         | build/**index**.html         |
| src/kit/about/**index**.kit   | build/about/**index**.html   |
| src/kit/projects/**free**.kit | build/projects/**free**.html |


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

[CodeKit][CK] should pick up all settings from the `config.codekit3` file when you drag the **[%Project Alias].Frontend** folder onto the CodeKit window.

### Windows/Linux

If you're on Windows or Linux, you could have a look at the [Prepros][PRE] app
for compiling the assets. (It's been a while since I've tried it so I'm not
sure if it's on par with what we get with CodeKit.)


[KIT]: https://codekitapp.com/help/kit/
[CK]:  https://codekitapp.com/
[PRE]: https://prepros.io/
