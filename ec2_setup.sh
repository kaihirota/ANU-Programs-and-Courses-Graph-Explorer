# sudo apt install git

# install node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
# activate nvm
. ~/.nvm/nvm.sh
# install node
nvm install node
# test
node -e "console.log('Running Node.js ' + process.version)"

export NODE_OPTIONS=--openssl-legacy-provider

npm install
npm run build
npm prune


npm i -g pm2
pm2 start build/index.js

sudo apt-get install nginx
sudo mv nginx_default /etc/nginx/sites-enabled/default
sudo service nginx start