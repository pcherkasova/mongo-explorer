mydir="$(dirname "$BASH_SOURCE")"
cd $mydir
cd ../../
pwd
git add -A
git commit -m "small refactoring"
git push github master


