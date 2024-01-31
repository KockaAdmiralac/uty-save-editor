# UTY Save Editor

A save editor for the [Undertale](https://undertale.com/) fangame
[Undertale Yellow](https://gamejolt.com/games/UndertaleYellow/136925).

## Usage
The save editor is currently available on
[uty-save-editor.netlify.app](https://uty-save-editor.netlify.app/). It has not
been thoroughly tested and there may be bugs. Did you find an error which you
don't understand? Do you want to propose a feature which is missing? Does
something not seem very logical or obvious to you when using the editor? Then
please open an [issue](https://github.com/KockaAdmiralac/uty-save-editor/issues)
for your feedback! I don't guarantee the fixes will always be fast, but I can
try my best.

### Features

- Supports all 4 types of save files (main save, persistent data, temporary save
  and game config)
- Can edit most important fields of the main save file
- Can edit most fields of other save files
- Fancy location picker which lets you visually select your location!
- Fun value picker! (You no longer need to remember what does each fun value
  mean.)
- Editing of GameMaker DS lists! (which are normally unreadable through a text
  editor)
    - For example, Dimensional Box items, Fast Travel locations...
- Templates for save files! You can get save files for the most important
  moments (such as the Pacifist final battle) in the game right through the
  editor, and then modify them to your desire.
- Helpful explanations of some options
- Tries to make you not shoot your foot while editing as much as possible
- Steamworks ID editing! (I bet you didn't need it)

## How can I help?
There are several ways in which you could help:

1. **Use the editor:** while using it, you can spot bugs and other issues with
   it and report them as issues.
2. **Do research:** there are many flags in the game which are not documented
   publicly yet. Research into the save file structure is currently available in
   this repository's `research` directory, and more thorough research into some
   flags is available
   [here](https://undertaleyellow.wiki.gg/wiki/User:FrostTheFrozenFox/Flags).
   If we discover the entire structure of the save file, it makes implementing
   its editing much easier!
3. **Curate save files:** there are some save file repositories (such as
   [this one](https://redd.it/18k23mu)) available, which could be used to
   curate the save files for the editor. What that means is to pick the save
   files for the most important moments, optimize their equipment to a
   reasonable extent and add them as templates to the editor. This way, users
   will be able to pick a predefined moment in the game to start from, while
   changing it the way they like.
4. **Add features:** you can also help develop new features for the save editor!
   Please consult the section below on how to get started with development.

## Development
You will need [Node.js](https://nodejs.org/), [Git](https://git-scm.com/) and
[Git LFS](https://git-lfs.com/) to run the site locally. After their
installation, clone the repository using:
```console
$ git clone https://github.com/KockaAdmiralac/uty-save-editor.git
```
then install the site's dependencies (while ignoring all "security" warnings)
using:
```console
$ npm install
```
and then you can run a local instance of the site on
[localhost:3000](http://localhost:3000/) using:
```console
$ npm start
```
