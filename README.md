
# Project Template 2022

This is our project setup for a website with a separate frontend repository.

## Using the template

- Click the **Use this template** button above to have GitHub create a new repository in your account. 
- Clone the repository down to your machine
- Rename the `project-template.Frontend` folder to better suit your project (e.g. `movietracker.Frontend` or maybe `secret-website-project.Frontend`?)
- If you're using TextMate:
	- Replace `project-template` in the `$TEST_DIR` variable inside the `.tm_properties` file with your new project name
- If you're using CodeKit:
	- Rename `$projectName` in `src/kit/shared/_constants.kit`
	- Drag the newly renamed frontend folder onto CodeKit for it to pickup the settings
- If you're using Nova:
	- Rename the `codekit.folder` + `workspace.name` keys in the `.nova/Configuration.json` file to suit your project
- Start coding!

## Directory Setup

The folder structure looks like this:

```text
[build]
[src]
  ├── [assets]
  ├── [components]
  ├── [js]
  ├── [kit]
  ├── [layouts]
  ├── [less]
  ├── [media]
  └── [panels]
[test]
[vendor]
```

### build & vendor

The `build` folder should be automatically built; more on that in a sec...
The `vendor` folder contains external modules, libraries and/or frameworks that are used in the frontend code.

### src/js & src/less

These are source files that compile into the
`build/assets` folder as `.js` & `.css` files, side by side.

The main Less file is `less/app.less` - it imports all the others and gets
compiled to `app.css` using _AutoPrefixer_.

The main JavaScript file is the `js/modules/app.js` file - you'll find two
wrapper files in the `js/` directory: `app.module.js` and `app.nomodule.js`. 
They both get processed and compiled into the `build/assets/` folder.
The `module.js` file only gets bundled, while the `nomodule.js` file is transpiled with Babel first and then bundled.

Both files are referenced from the HTML - in this way:

```html
<script type="module" src="/assets/app.module.js"></script>
<script nomodule defer src="/assets/app.nomodule.js"></script>
```

These are mutually exclusive since browsers that support the newer JavaScript
modules syntax will load the first one and ignore the second (due to the
`nomodule` attribute) while browsers that don't understand modules won't load
the first one because of the `type="module"` attribute, but gladly load the
second.

### test

The project template comes with [Jasmine][JAS] testing pre-configured. Open the
`SpecRunner.html` file in here to run the tests. There's a sample spec file in the
`spec` folder for you to look at.

### kit

The files in here are [Kit files][KIT] which compile to regular HTML files in
the `build` folder, maintaining their file structure, e.g.:


| Source file                   | Build file                   |
|-------------------------------|------------------------------|
| src/kit/**index**.kit         | build/**index**.html         |
| src/kit/about/**index**.kit   | build/about/**index**.html   |
| src/kit/projects/**free**.kit | build/projects/**free**.html |


### assets & media

These hold images, icons & maybe webfonts for use in the site; they should get
copied to the build folder (in `build/assets` and `build/media`
respectively).

Files in `assets` are for icons, images & fonts, while `media` is meant
for images that would ideally come from a CMS or similar.

### components, panels & layouts

The `components` folder should contain individual components of the site, like
buttons, cards etc.

Larger elements that wraps a couple (or a list) of elements gets to go into the
`panels` folder.

Full page layouts go into the `layouts` folder.

These are part of the vendored [Componentize][CPL] files.

## Build Setup

The template ships with a pre-configured config file for CodeKit but if you're
more comfortable with **webpack** or similar, here's what's being done:

- JavaScript, Less and assets are built into a `/build/assets/` folder in the root of the project
- Files in `media` are copied into `/build/media/`
- Kit files are processed and compiled as described earlier to end up as HTML files in the root and maybe some subfolders

### CodeKit (macOS)

[CodeKit][CK] should pick up all settings from the `config.codekit3` file when you drag the **project-template.Frontend** folder onto the CodeKit window.
CodeKit even has a [Read-Only Mode][ROM] that allows for using the app without a license. You just can't change any of the settings.

### Windows/Linux

If you're on Windows or Linux, you could have a look at the [Prepros][PRE] app
for compiling the assets. (It's been a while since I've tried it so I'm not
sure if it's on par with what we get with CodeKit.)


[KIT]: https://codekitapp.com/help/kit/
[CK]:  https://codekitapp.com/
[PRE]: https://prepros.io/
[CPL]: https://github.com/greystate/componentize/
[ROM]: https://codekitapp.com/help/read-only/
[JAS]: https://jasmine.github.io/
