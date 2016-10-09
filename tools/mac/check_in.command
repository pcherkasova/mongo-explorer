mydir="$(dirname "$BASH_SOURCE")"
cd $mydir
cd ../../
pwd
git add -A
git commit -m "minor fixes"
git push github master


