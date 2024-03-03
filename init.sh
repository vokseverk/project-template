CURRENT_DIR=`pwd`
PROJECT_NAME=`basename "$CURRENT_DIR"`

if [ -e "project-template.Frontend" ]; then
	mv "project-template.Frontend" "${PROJECT_NAME}.Frontend"
	echo "Renamed project-template as ${PROJECT_NAME}"
else
	echo "Folder 'project-template.Frontend' not found."
fi
