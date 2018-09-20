# Ashkeeper's Rest Website

A Website project for me and my friends.  We want to build a website for our community of friends and
learn JS, React, Redux, etc. along the way.

# Dev Environment Setup
## Requirements
- [Node.js and NPM](https://www.npmjs.com/)
- [Composer](https://getcomposer.org/)
- [PHP 7.1+](http://php.net/downloads.php) - Note, if you install PHP manually, make sure to add it to your system-wide path variable. If you are unsure of what thread type to select, we recommend using the non thread safe version.
- [MySQL Community Server 8.0](https://dev.mysql.com/downloads/mysql/) - Refer to setup instructions to get it configured for your dev environment. (You will need an oracle account)

A note about IDE's: Use whatever you want, but if you're not sure what to choose, consider [Visual Studio Code](https://code.visualstudio.com/) (VS Code).  This is a fancy text editor that supports a rich development experience for JavaScript while still trying to be as lightweight as possible.  While it doesn't need any plugins to be useful right out of the box, there are quite a few very useful ones out there.  A later section will cover some VS Code setup.

## Front End Setup
Must be done for each new setup
1. In a terminal (CMD, Powershell, or a Unix terminal emulator), navigate to the Ash.FrontEnd directory
    - Note: Opening a VS Code window to this folder will start a Powershell terminal there too (default terminal is powershell, this is configurable)
2. Run `npm install` to install Node dependencies
    - Dependencies stored in `node_modules` folder in the same directory where the command is run

## Running the Front End
1. Run `npm run dev` to start up the dev environment 
    - Runs webpack-dev-server
    - Watches for changes in its files and updates whenever it detects one

## Back End Setup
Must be done for each new setup
### Setup MySQL
It is assumed MySQL Server Community Edition Installer has already been downloaded
1. Run the installer.
2. Accept the license agreement.
3. Choose the setup type you want. Recommended setup type is Developer Default (If you want something more lightweight, you can install products from GA servers only.)
4. Install those products on the next screen.
5. In the product configuration leave everything default unless otherwise specifically mentioned.
6. In the authentication method configuration, select the use legacy authentication method option.
7. When you get to accounts and roles pick a good password for root. You can use this account for the application in your development environment although it is not recommended to run everything on root in production
8. Keep going using default settings until the finish.
9. Installation should now be finished.
10. Open up a MySQL Command Line Client, type in the root password, and enter in the following command
    `CREATE DATABASE ashkeepersrestwebsite;`


### Setup Laravel
1. In a terminal (CMD, Powershell, or a Unix terminal), navigate to the Ash.BackEnd directory
    - Note: Opening a VS Code window to this folder will start a Powershell terminal there too (default terminal is powershell, this is configurable)
2. Copy `.env.example` file to `.env`
    - This is local and will not be committed to the repo
    - Put your previously made MySQL password into the `.env` file in the `DB_PASSWORD` entry, and if you are not using the root user, change the `DB_USERNAME` parameter appropriately as well.
3. Run `composer install` to install php dependencies
4. Run `php artisan key:generate` to generate a key for the Laravel server

## Running the Back End
1. Make sure MySQL server is running
2. Run `php artisan migrate` To scaffold any new database migrations (Do not have to do this on every run, but is a good idea after every pull)
3. Run `php artisan serve`
    - Runs a local dev server
    - PHP supports live editing, so you do not have to restart the server for every change

### Notes
- For now, you must run both back end and front end to do development
    - In the future, we may figure out a way to proxy a testing server
- Ctrl-C will stop running terminal processes

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
