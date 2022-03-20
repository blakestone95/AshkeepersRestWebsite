# Ashkeeper's Rest Website

A Website project for me and my friends. We want to build a website for our community of friends and
learn JS, React, Redux, etc. along the way.

# Dev Environment Setup

Our dev environment is now set up to use Docker! If you cannot or don't want to use docker, follow the legacy setup instructions at the bottom of this README.

## Requirements

Installing the requirements is operating system dependent and is left as an exercise for the reader. Some helpful links are provided.

- docker
  - [Windows instructions](https://docs.docker.com/docker-for-windows/)
  - [Windows download](https://hub.docker.com/editions/community/docker-ce-desktop-windows)
  - [Ubuntu instructions](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- docker-compose
  - [Install instructions](https://docs.docker.com/compose/install/)

### A note about IDEs

Use whatever you want, but if you're not sure what to choose, consider [Visual Studio Code](https://code.visualstudio.com/) (VS Code). This is a fancy text editor that supports a rich development experience for JavaScript while still trying to be as lightweight as possible. While it doesn't need any plugins to be useful right out of the box, there are quite a few very useful ones out there. A later section will cover some VS Code setup.

### Dev environment setup

1. Copy the [docker-compose.yml.example](docker-compose.yml.example) to [docker-compose.yml](docker-compose.yml)

   - You can change any ports that conflict with any currently running services in [docker-compose.yml](docker-compose.yml)
   - Ensure any changes are also reflected in the .env file that is by the install script created in step 3
   - If you aren't doing front end development, you can use the [production client Dockerfile](client/Dockerfile) in your local [docker-compose.yml](docker-compose.yml) as it is faster and lighterweight

1. Spin up the docker containers with the docker compose command in the folder where the [docker-compose.yml](docker-compose.yml) file is located

   `docker-compose up -d --build`

   - The first run will take a while as the containers need to be built but subsequent runs should be fast
   - You can use `docker-compose up -d` when you don't need to build the containers

1. (Unix only) Create dependency folders

   `mkdir ./server/vendor && mkdir ./client/node_modules`

   - If these directories are not created by the user, they will be created by docker and automatically be owned by root, inaccessible to the containers
   - For a more customize setup, you may want to change the uid and gid that docker uses for the containers' users (just don't commit any of those changes to the repo).  The containers use users with uid 1000 and gid 1000 by default.
   - The subsequent steps will fail with a permissions error if you don't do this part

1. Run the server install script to setup Laravel

   `docker-compose exec api bash -c "cd server && ./install.sh"`

   - This installs PHP dependencies and seeds the database
   - You can rerun this command to revert the dev environment to it's default state

1. Run the front end install command to setup React

   `docker-compose exec client bash -c "cd client && npm install"`

   - This installs JS dependencies and also loads any git hooks defined in [githooks](githooks) with a postinstall script
   - Use the follow command instead if you are using the production build:

   `docker-compose exec client bash -c "cd client && npm install && npm build"`

### API Server

The api server should now be installed and running on [http://localhost:8080/api/](http://localhost:8080/api/) (The trailing slash is important because otherwise nginx running in the docker container won't redirect the port correctly because the docker contianer port and the host port it's mapped to are different. So you will end up at `http://localhost/api`)

### React Front End

#### development

The development build is the default configuration. To run the project, do the following:

1. Enter the bash shell of the api container with `docker-compose exec client bash`
1. Move to the front end directory with `cd client`
1. Run `npm start` to run webpack dev server
1. Access the dev site on [http://localhost:8000](http://localhost:8000) (rather than port 8080)

In development mode, you gain the following benefits:

- Changes trigger automatic rebuilds which are faster than rebuilding using webpack normally
- Improved (more verbose) debug information and source maps for JS and CSS
- All built files are stored in memory and are never written to disk, reducing I/O time on builds
- Hot reloading (once we set it up) - _need more info_

#### production

If choosing to use only the production build, no additional setup is needed. The site can be visited at [http://localhost:8080](http://localhost:8080).

## Docker usage

### Current Structure

The current structure can be seen in the [docker-compose.yml](docker-compose.yml) file. Folowing are descriptions of and notes for the containers:

- webserver: nginx server that serves up the webserver files to your local machine
  - Runs on port 8080 (default) - [http://localhost:8080](http://localhost:8080)
  - Serves front end from the root `/` (when in production mode) and backend routes from `/api/`
- mariadb: MariaDB database to store user-generated content, etc.
  - Runs on port 3306 (default)
- dbadmin: phpMyAdmin interface for the MariaDB database
  - Runs on port 8081 (default) - [http://localhost:8081](http://localhost:8081)
- api: Laravel PHP server that provides data from the database, etc. for the front end
- client: provides built React front end files to be served to the browser
  - Development configuration runs on port 8000 (default) - [http://localhost:8000](http://localhost:8000)
    - NOTE: Development mode requires access to the entire project in order for the `lint-staged` package to perform it job properly
  - Production mode writes the built files to disk, which the webserver container will pick up

### Common/Useful Commands

- Bring up containers with `docker-compose up -d`
- Kill all containers with `docker-compose down`
- Kill a container with `docker-compose down [container]`
- Restart containers with `docker-compose restart [container]`
- You can rebuild a single container with `docker-compose build --no-cache [container1] [container2...]`
- You can completely rebuild everything if you mess something up with the command
  `docker-compose down -v --rmi all --remove-orphans && docker-compose up -d`

## Other Setup Notes

- For now, you must run both back end and front end to do development
  - In the future, we may figure out a way to proxy a testing server

# VS Code

Useful plugins:

- ESLint
  - Checks for syntax errors and other potential code problems
- Prettier
  - Automatic JS formatter (please use this)
  - Alt-Shift-F invokes the formatter
- GitLens
  - A bunch of Git-related features
- Bracket Pair Colorizer
  - Self explanatory; super useful
- Path Intellisense
  - Helps out with typing paths in your code
- Python
  - All-in-one package for python editing in VS Code
- vscode-icons
  - Tons of neat icons for files and folders in VS Code

# Dev Environment Setup (Legacy)

## Requirements

- [Node.js and NPM](https://www.npmjs.com/)
- [Composer](https://getcomposer.org/)
- [PHP 7.4+](http://php.net/downloads.php) - Note, if you install PHP manually, make sure to add it to your system-wide path variable. If you are unsure of what thread type to select, we recommend using the non thread safe version.
- [MySQL Community Server 8.0](https://dev.mysql.com/downloads/mysql/) - Refer to setup instructions to get it configured for your dev environment. (You will need an oracle account)

## Front End Setup

Must be done for each new setup

1. In a terminal (CMD, Powershell, or a Unix terminal emulator), navigate to the client directory
   - Note: Opening a VS Code window to this folder will start a Powershell terminal there too (default terminal is powershell, this is configurable)
1. Run `npm install` to install Node dependencies
   - Dependencies stored in `node_modules` folder in the same directory where the command is run
   - The postinstall script will also apply our git hooks to the project
     - We previously used `husky` to automate this, but it doesn't work correctly with docker

## Running the Front End

1. Run `npm run watch` to start up the dev environment
   - Runs webpack-dev-server
   - Watches for changes in its files and updates whenever it detects one

## Back End Setup

Must be done for each new setup

### Setup MySQL

It is assumed MySQL Server Community Edition Installer has already been downloaded

1. Run the installer.
1. Accept the license agreement.
1. Choose the setup type you want. Recommended setup type is Developer Default (If you want something more lightweight, you can install products from GA servers only.)
1. Install those products on the next screen.
1. In the product configuration leave everything default unless otherwise specifically mentioned.
1. In the authentication method configuration, select the use legacy authentication method option.
1. When you get to accounts and roles pick a good password for root. You can use this account for the application in your development environment although it is not recommended to run everything on root in production
1. Keep going using default settings until the finish.
1. Installation should now be finished.
1. Open up a MySQL Command Line Client, type in the root password, and enter in the following command
    `CREATE DATABASE ashkeepersrestwebsite;`

### Setup PHP

1. Go to your php installation directory, and copy/paste the php.ini-development as php.ini in the same folder.
1. Open the php.ini file and change any settings you want to change in there.
1. The following extensions should be enabled at the very least (if on windows):
   - php_mbstring.dll
   - php_openssl.dll
   - php_pdo_mysql.dll
   - php_curl.dll
   - php_fileinfo.dll
1. If on linux, the extensions can be installed through the package manager.

### Setup Laravel

1. In a terminal (CMD, Powershell, or a Unix terminal), navigate to the Ash.BackEnd directory
   - Note: Opening a VS Code window to this folder will start a Powershell terminal there too (default terminal is powershell, this is configurable)
1. Copy `.env.example` file to `.env`
   - This is local and will not be committed to the repo
   - Put your previously made MySQL password into the `.env` file in the `DB_PASSWORD` entry, and if you are not using the root user, change the `DB_USERNAME` parameter appropriately as well.
1. Run `composer install` to install php dependencies
1. Run `php artisan key:generate` to generate a key for the Laravel server

## Running the Back End

1. Make sure MySQL server is running
1. Run `php artisan migrate` To scaffold any new database migrations (Do not have to do this on every run, but is a good idea after every pull)
   - If you want to seed the database as well, add the --seed option
   - If you get a PDOException::("could not find driver") at this point, it's because you don't have your php extensions configured correctly
1. Run `php artisan serve`
   - Runs a local dev server
   - PHP supports live editing, so you do not have to restart the server for every change
