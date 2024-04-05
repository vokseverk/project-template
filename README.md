# Project Template 2024

This is our project setup for a website with a separate frontend repository.

## Using the template

- [ ] Click the **Use this template** button above to have GitHub create a new repository in your account.
- [ ] Clone the repository down to your machine
- [ ] Run the `init.sh` script to rename the `project-template.Frontend` folder same as your project (e.g. if you named the project `movietracker` it'll be named `movietracker.Frontend`)

### If you're using [Nova][NOVA]:

- [ ] Rename the `workspace.name` keys in the `.nova/Configuration.json` file to suit your project
- [ ] Choose the `.Frontend` folder in the CodeKit Extension's settings screen

### If you're using [CodeKit][CK]:

- [ ] Rename `$projectName` in `src/kit/shared/_constants.kit`
- [ ] Drag the newly renamed frontend folder onto CodeKit for it to pickup the settings

### If you're using [TextMate][TM2]:

- [ ] Replace `project-template` in the `$TEST_DIR` variable inside the `.tm_properties` file with your new project name


*Start coding!*


## Using this with a project on Umbraco Cloud

This repository is already set to ignore a `*.Web` folder, so clone your cloud project into
that, like this:

```bash
$ git clone --origin LIVE https://scm.umbraco.io/euwest01/PROJECT_ALIAS.git PROJECT_NAME.Web
```

There's a helper script (`clone.sh`) included for this that can be called like this:

```bash
$ ./clone.sh PROJECT_ALIAS
```

You can use the *Umbraco > Run* task in Nova to start the cloned site. After you've run the site
for the first time, grab the port number and put it in the `src/kit/shared/_constants.kit`,
replacing the dummy `12345` in the `$portNumber` constant.

The *Frontend > Build* task is for copying the compiled assets etc. from the `.Frontend`
build folder to the current `.Web` assets folder.

There are corresponding *Run Umbraco site* and *Build and deploy frontend* tasks supplied
for Visual Studio Code as well.

> [!IMPORTANT]
> If the Umbraco site is using [uSkinned SiteBuilder][US] you need to make sure that the package
> migrations are not executed on subsequent environments or for anyone else cloning the site.
> This is done in the `appsettings.json` file under the `Umbraco::CMS` key:

```json
"Umbraco": {
	"CMS": {
		"PackageMigration": {
			"RunSchemaAndContentMigrations": false,
			"AllowComponentOverrideOfRunSchemaAndContentMigrations": false
		}
	}
}
```


## Directory Setup

The folder structure inside `.Frontend` looks like this:

```text
[build]
[icons]
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

### icons

The `icons` folder holds [the bare minimum][ICNS] to supply the website with a working favicon etc.
You should modify them all like this:

- [ ] Modify the `icon.svg` file (keep it square)
- [ ] Export (or modify) the 512×512 PNG (`icon-512.png`)
- [ ] Export the 192×192 & 180×180 (`apple-touch-icon.png`) versions from that
- [ ] Use [X-Icon Editor][ICNX] to create the `favicon.ico` file by importing and tweaking there
- [ ] Replace `project-template` in the `icons/manifest.webmanifest` file with your project name

### test

The project template comes with [Jasmine][JAS] testing pre-configured. Open the
`SpecRunner.html` file in a browser (in Nova there should be a "Test" task available)
to run the tests. There's a sample spec file in the `spec` folder for you to look at.

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


[KIT]:  https://codekitapp.com/help/kit/
[CK]:   https://codekitapp.com/
[PRE]:  https://prepros.io/
[CPL]:  https://github.com/greystate/componentize/
[ROM]:  https://codekitapp.com/help/read-only/
[JAS]:  https://jasmine.github.io/
[NOVA]: https://nova.app/
[TM2]:  https://macromates.com/
[ICNS]: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
[ICNX]: https://www.xiconeditor.com/
[US]:   https://uskinned.net/
