Card Generator

Create PDFs in your browser with generated HTML based on your CSV data and custom CSS.
version 2.5
copyleft JerryLabs 2020-2022
use according your conscience

requires: Node.js & NPM

usage:

```
npm install
http-server {folder_name}
node generate {folder_name} [log | cards {filename}]
```

This script consumes your CSV and generate structured HTML in source folder with cards elements based on it. Run the http-server to serve the images in specified folder. View HTML in the browser and print/save as PDF.

input: folder named {folder_name} including:
* cards.csv - structured data with your cards
* style.css - containing styles for .card and other fields used in your csv + optionally .background if you need that
* card.js (optional) - for including specific logic to transform CSV data to correct HTML markup
* illustrations or other images for your cards (so http-server can be started here)

Optional parameters:
* log - throws up the HTML data directly to the console
* cards - custom file instead of cards.csv, name must follow as next parameter

See "test" folder for demonstrative example including comments with further instructions where needed. Please to not hesitate to contact me or pull request any interesting idea since this is my first Node.js server script.

For the first run, try

```
http-server test &
node generate test
```

which should do the stuff and generate test.html in the test folder. In fact you do not need http-server because images are not working in default card generating function.

Generate english CMZC cards:

```
node generate cmzc-horizontal cards cards-en.csv
```
