CURRENT_DIR=`pwd`
PROJECT_NAME=`basename "$CURRENT_DIR"`

if [ -e "${PROJECT_NAME}.Web" ]; then
	read -p "Enter password for the admin user (min. 10 chars): " PASSWORD

	if [[ $PASSWORD == "" ]]; then
		exit 1
	else

		dotnet new install Umbraco.Templates --force

		dotnet new umbraco --force -n "UmbracoProject" --friendly-name "Administrator" --email "umbracoadmin@vokseverk.dk" --password "${PASSWORD}" --development-database-type SQLite

		echo "New Umbraco website created in $PROJECT_NAME.Web/UmbracoProject"
	fi
else
	echo "Folder '${PROJECT_NAME}.Web' not found."
fi
