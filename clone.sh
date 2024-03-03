CURRENT_DIR=`pwd`
PROJECT_NAME=`basename "$CURRENT_DIR"`
REGION="${2:-euwest01}"
PROJECT_ALIAS=$1

if [ ! "$PROJECT_ALIAS" = "" ]; then
	git clone --origin LIVE "https://scm.umbraco.io/${REGION}/${PROJECT_ALIAS}.git" "${PROJECT_NAME}.Web"
else
	echo <<ENDDOC
You must specify the project's alias, e.g.:
\$ source clone.sh my-project-alias
ENDDOC
fi
