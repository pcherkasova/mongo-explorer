mydir="$(dirname "$BASH_SOURCE")"
cd $mydir
cd ../../
pwd
git add -A
git commit -m "small changes"
git push hithub master
git push heroku master

