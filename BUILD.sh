echo "Building frontend"

# 2. Read the assetsFolder setting from the appsettings.json file
# 3. Create a new assets/AxBx/ folder in the .Web project
# 4. Copy the build/assets/ folder from the .Frontend project into the new folder in the .Web project

# Project settings sample to add to the root of appsettings.json:
# (If you change the root key, change the SETTINGS_ROOT variable below as well)
#
# "ProjectSettings": {
# 	"assetsVersion": "A0B0",
# 	"mainStyleSheet": {
# 		"name": "app.css",
# 		"version": "A0B1"
# 	},
# 	"mainScriptFile": {
# 		"moduleFile": "app.module.js",
# 		"legacyFile": "app.nomodule.js",
# 		"version": "A0B2"
# 	}
# }

SETTINGS_ROOT="ProjectSettings"

# Configuration variables - these should be supplied on the command line

PROJECT_ROOT="${TM_PROJECT_DIRECTORY}"
PROJECT_SHORTNAME="${TM_PROJECT_NAME}"

DEBUG=yes

if [[ $PROJECT_SHORTNAME == "" ]]; then
	echo "You must supply the TM_PROJECT_NAME environment variable!"
	exit 1
fi

# ================================================ #

UMB_DIR="${PROJECT_ROOT}/${PROJECT_SHORTNAME}.Web" # The Web site's root
FRONTEND_DIR="${PROJECT_ROOT}/${PROJECT_SHORTNAME}.Frontend" # The frontend files

SETTINGS_FILE="${UMB_DIR}/src/UmbracoProject/appsettings.json"

# Get current asset versions from appsettings.json
ASSETS_VERSION=`jq -r '.'"${SETTINGS_ROOT}"'.assetsVersion' ${SETTINGS_FILE}`

# Handle CSS & JS specially by versioning them (so we can bump them without invalidating all other assets)

CSS_FILE=`jq -r '.'"${SETTINGS_ROOT}"'.mainStyleSheet.name' ${SETTINGS_FILE}`
CSS_VERSION=`jq -r '.'"${SETTINGS_ROOT}"'.mainStyleSheet.version' ${SETTINGS_FILE}`

JS_FILE=`jq -r '.'"${SETTINGS_ROOT}"'.mainScriptFile.moduleFile' ${SETTINGS_FILE}`
LEGACY_JS_FILE=`jq -r '.'"${SETTINGS_ROOT}"'.mainScriptFile.legacyFile' ${SETTINGS_FILE}`
JS_VERSION=`jq -r '.'"${SETTINGS_ROOT}"'.mainScriptFile.version' ${SETTINGS_FILE}`

if [ $DEBUG == "yes" ]; then
	echo "Found $ASSETS_VERSION (CSS: $CSS_FILE @v $CSS_VERSION) (JS: $JS_FILE @v $JS_VERSION / $LEGACY_JS_FILE)"
fi

if [ $CSS_VERSION == null ]; then
	CSS_FILENAME="${CSS_FILE}"
else
	CSS_BASENAME=`basename -s .css $CSS_FILE`
	CSS_FILENAME="${CSS_BASENAME}.${CSS_VERSION}.css"
fi

if [ $JS_VERSION == null ]; then
	JS_FILENAME="${JS_FILE}"
	JS_LEGACY_FILENAME="${LEGACY_JS_FILE}"
else
	JS_BASENAME=`basename -s .js $JS_FILE`
	JS_FILENAME="${JS_BASENAME}.${JS_VERSION}.js"
	JS_LEGACY_BASENAME=`basename -s .js $LEGACY_JS_FILE`
	JS_LEGACY_FILENAME="${JS_LEGACY_BASENAME}.${JS_VERSION}.js"
fi

DEPLOY_DIR=$UMB_DIR/src/UmbracoProject/wwwroot/assets/$ASSETS_VERSION

BUILD_DIR="${FRONTEND_DIR}/build"

if [[ $DEBUG == yes ]]; then
	echo "Deploying to $DEPLOY_DIR"
fi

# Remove the DEPLOY_DIR if it exists already
if [[ -e "$DEPLOY_DIR" ]]; then
	echo "Removing existing builds"
	rm -rf "$DEPLOY_DIR"
	# rm -rf "$ICONS_DIR"
fi

# Create the DEPLOY_DIR
echo "Create new $ASSETS_VERSION dir"
mkdir -p "$DEPLOY_DIR/fonts"

# Copy assets
echo "Copy asset files, renaming versioned CSS + JS"
cp $BUILD_DIR/assets/*.* $DEPLOY_DIR
mv $DEPLOY_DIR/$CSS_FILE $DEPLOY_DIR/$CSS_FILENAME
mv $DEPLOY_DIR/$JS_FILE $DEPLOY_DIR/$JS_FILENAME
mv $DEPLOY_DIR/$LEGACY_JS_FILE $DEPLOY_DIR/$JS_LEGACY_FILENAME

# Copy fonts
if [[ -d "$BUILD_DIR/assets/fonts" ]]; then
	echo "Copy font files"
	cp $BUILD_DIR/assets/fonts/*.* $DEPLOY_DIR/fonts
fi
