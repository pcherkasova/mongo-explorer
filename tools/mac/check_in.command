mydir="$(dirname "$BASH_SOURCE")"
cd $mydir
cd ../../
pwd
git add -A
git commit -m "privacy statement and cosmetic changes"

git push github master
git push heroku master

