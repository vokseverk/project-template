CURRENT_DIR=`pwd`
PROJECT_NAME=`basename "$CURRENT_DIR"`
REGION="${2:-euwest01}"
PROJECT_ALIAS=$1

if [ ! "$PROJECT_ALIAS" = "" ]; then
	git clone --origin LIVE "https://scm.umbraco.io/${REGION}/${PROJECT_ALIAS}.git" "${PROJECT_NAME}.Web"
else
	cat <<ENDDOC

You must specify the project's alias, e.g.:

\$ ./clone.sh my-project-alias

If you need to clone from another region than the default (euwest01), you can
specify that as well, e.g.:

\$ ./clone.sh my-project-alias uswest01

ENDDOC
fi
