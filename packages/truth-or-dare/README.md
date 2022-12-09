## Truth or dare generator (used in Troof!)

> This generator takes all truths and dares in .txt form and saves it as a json file. It also can separate the truths and dares into two different files.

### How to use

1.  Open the "textfiles" folder on your computer.
2.  Add all the dares and truths that you want to include in the game. Each truth or dare should be on its own line in a separate file.
3.  **Name each file with a descriptive name that reflects the content of the file, and end the file name with a capital T for truths or a capital D for dares.**
    - For example, you could name a file "funny_dares-D.txt" if it contains funny dares.
    - You could name a file `funny_truths-T.txt` if it contains funny truths.
    - There is a possibility that the program will not work as expected if you do not follow this naming convention.
4.  Save the files in the "textfiles" folder.

### To generate json files

6.  Open a terminal window on your computer.
7.  Run the command `yarn generate` to generate the json files.

### Code Snippet

Extract the sentences in the format of

1. Sentence 1
2. Sentence 2

```js
let str = [];

[...Array.from(document.getElementsByTagName("p"))].forEach((p) => {
	const m = p.innerText.matchAll(/^\d\d\. (.+)/g);
	const arr = Array.from(m, m[1]);

	if (arr.length > 0) {
		str.push(arr[0][1]);
	}
});
```
