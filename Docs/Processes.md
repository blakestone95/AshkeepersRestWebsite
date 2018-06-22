# Source Control
This document describes how we will manage our project's source control (git) process.  The goal of this process is to help us communicate and keep track of things in a clear and efficient manner.

#### NOTE: THIS DOCUMENT IS LIKELY TO CHANGE AS WE REFINE OUR PROCESS

# Requirements
- Install [Git](https://git-scm.com/downloads)

## Neat Git Tools
- [Source Tree](https://www.sourcetreeapp.com/)
    - This one is very good, several of our team members can vouch for it's usefulness
- [Git Kraken](https://www.gitkraken.com/)

# Repository Structure
Our repo structure will have the following branches after the first release:
- master
    - production branch; this code will be up-to-date with what is currently running on the server
- development
    - active development
- testing
    - tracked separately to prevent changes to features that are currently being tested

# Development
## Projects and Issues
You will be assigned GitHub Issues to complete.  Each issue will have a description and a set of acceptance criteria.  Feel free to comment on issues, but refrain from editing the description or acceptance criteria without getting confirmation from the team first.

Your issues will be placed in a Project board.  When you begin work on an issue, make sure you move that issue from "To do" to "In progress" to let others know that you're working on it.

Once you think you've completed your issue, move it to the "Testing" column to let testers know that it's ready to be tested.

From there, your issue will either be closed by the tester, or sent back to "In progress", with a comment, if it didn't meet the acceptance criteria.

## Branching
Developers will branch off the *development* branch to begin a feature or fix or whatever, and will create a **pull request** to merge back into this branch when they are finished.

Every branch of new development will have a prefix to categorize them:
- feature
- bugfix

Usage of these prefixes should be obvious.  With this in mind, every new branch name will follow this template:

```
prefix/a-descriptive-name
```

Note: In Source Tree, this naming style produces a folder-like structure (not sure if this is standard, or just part of Atlassian's added features)

## Committing
It is generally up to the developer to choose when they want to create a commit and how they want to compose their commit messages.  Some advice:

1. Avoid committing code that doesn't work
2. If you do, put a note "non-working commit" at the end of your commit message
3. Commit when you have a part of your feature working
    - For example, when you...
    - ...Create a new React component
    - ...Add new functions
    - ...Mass rename stuff
    - ...Fix text
4. Don't commit without briefly testing your own changes first
5. To compose good commit messages, imagine that each sentence in the primary part of the message begins with "This commit will..."
6. Be concise in the primary part of the commit message
    - This is what people will see first when they see previews of the commit (like in the commit tree)
7. Reference GitHub issue numbers related to the code you are working on
8. Add any additional prevalent info after the issue number

An example of a good commit message:

```
Add calendar component.  Make "event calendar" tab go to new calendar component.

#10
Also I need to note some stuff here that might be relevant to someone who wants to know some of that other changes I made in this commit.  They didn't really deserve their own note up above, though, so I noted them down here instead.  It's up to me to decide what things are relevant enough to put in the primary section, and what stuff, if any, I should put down here instead.
```

Notice that the phrase "This commit will..." may be said in front each sentence in the first line and it still makes sense.

Follow this advice and you will make people happy!

## Pull Requests
Before you can merge your changes back into *development*, you must open a **pull request** so that other developers may review your code.

It is essential for developers to review each other's work to make sure that we maintain a high standard of code.  On that note, as a reviewer, do your best to read over the code that is being submitted and give good feedback.  Do not be afraid to ask why someone used a particular method, to offer suggestions on improvements, or to ask for clarification of a block of code.  Evaluating ourselves and each other is how we improve.

Once another developer has approved your **pull request**, you are allowed to merge it into the *development* branch.  Waiting for feedback from multiple people is never a bad idea, however.

# Testing
It's important to continually test features as you develop.  You, as a developer, are the first line of defense for catching bugs, and the hope is that you make tester's jobs very easy.

## Unit Tests
Though it is difficult to write automated tests for web applications, there are a few things we want to have tests for.  You should write tests for functionality that does not depend on users' actions.  One example is utility or helper functions on the front-end or back-end.

Don't spend huge amounts of time writing tests, but they are useful to preemptively catch bugs and verify functionality in order to save time later.

##### Update later with the testing library we're using.  Jest and Cypress are good options.

## Regression Testing
Whenever refactoring occurs, whether it be to improve existing functionality, or upgrade packages or whatever, it's important to retest what changed.  This will follow the regular testing process.

## Testing process
A separate branch exists for testing.  The idea is that this prevents things from changing on a tester who is partway through testing a feature.  This prevents the introduction of bugs that testers might miss.

1. Separate issues will be created for tests, referencing the issues that will be tested
2. The person who is assigned this test issue (the tester) will indicate they have begun testing by moving their testing issue from "To do" to "In progress"
3. The tester will read the acceptance criteria for the issue and check if each criteria is met
4. If the criteria is met, the tester will close the issue and move it from "Testing" to "Done" on the Project
5. If the criteria is **not** met, the tester will send the issue back to the "In progress with a comment on what was not met
6. Should the tester encounter any bugs during their testing, they should create a new bug issue and put it in the appropriate Project's "To do" column
7. Once every linked issue is closed, the tester may close the testing issue and move it from "In progress" to "Done" on the Project.

# Release
Once development on a pre-determined set of features has been completed, we will go through a release process to get the next version of our web app released.

Incremental Steps

1. Features or bug-fixes are merged from *development* into *testing*
2. Designated testers will check the incoming features and fixes
3. Testers will submit issues for any bugs that are found

During release

1. *testing* is merged into *master*
2. The developer in charge of the deployment will run `npm run build` on the *master* branch, having pulled the latest changes
    - Built files are automatically placed where they need to go for the back-end
3. Folder Legion.BackEnd is zipped up, ready to be deployed to the server

#### NOTE: THIS PROCESS IS LIKELY TO CHANGE