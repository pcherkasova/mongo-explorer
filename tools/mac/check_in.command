mydir="$(dirname "$BASH_SOURCE")"
cd $mydir
cd ../../
pwd
git add -A
git commit -m "provided examples for different queries"
git push github master


