CURRENT_DIR=`pwd`
PROJECT_NAME=`basename "$CURRENT_DIR"`

if [ -e "${PROJECT_NAME}.Web" ]; then
	cd $PROJECT_NAME.Web

	echo "Enter password for the admin user (min. 10 chars): "
	read PASSWORD

	if [[ $PASSWORD == "" ]]; then
		exit 1
	else
		dotnet new install Umbraco.Templates::13.10.0 --force

		dotnet new umbraco --force -n "UmbracoProject" --friendly-name "Administrator" --email "umbracoadmin@vokseverk.dk" --password "${PASSWORD}" --development-database-type SQLite

		cd ..
		echo "New Umbraco website created in $PROJECT_NAME.Web/UmbracoProject"
	fi
else
	echo "Folder '${PROJECT_NAME}.Web' not found."
fi
