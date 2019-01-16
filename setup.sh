if [ ! -f node_modules/.cache/setup/package.json ] || ! cmp -s package.json node_modules/.cache/setup/package.json\
  # || [ ! -f node_modules/package-lock.gitlab-ci.json ] || ! cmp -s package-lock.json node_modules/package-lock.gitlab-ci.json
then
  mkdir -p node_modules/.cache/setup
  cp -rf package.json node_modules/.cache/setup/package.json.tmp
  # cp -rf package-lock.json node_modules/.cache/setup/package-lock.json.tmp
  # npm config set registry https://registry.npm.taobao.org
  npm install
  mv -f node_modules/.cache/setup/package.json.tmp node_modules/.cache/setup/package.json
  # mv -f node_modules/.cache/setup/package-lock.json.tmp node_modules/.cache/setup/package-lock.json
fi
