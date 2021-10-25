let fs = require('fs');
let arg = process.argv;
let unusedLetters = 0;
let dictionary = new Array();
let alph = new Array();
let tree = new Array();
let i = 0;
let code = '';
let decodeString = '';
let decode = '';

function Node(letter, freq, used, left, right, code){
	this.letter = letter;
	this.freq = freq;
	this.used = used;
	this.left = left;
	this.right = right;
	this.code = code;
}	

function Key(value, array){
	for (let key in value){
		if (array[key] == value){
			return key;
		}
	}
	return false;
}

function findTwoMin(){ //ищем 2 элемента с минимальными частотами
	let min1 = Number.POSITIVE_INFINITY;
	let min2 = Number.POSITIVE_INFINITY;
	let minIndex1 = 0;
	let minIndex2 = 0;
	for (let i = 0; i < tree.length; i++){
		if (tree[i].used == true){
			continue;
		}	
		if (tree[i].freq < min1){
			min2 = min1;
			minIndex2 = minIndex1;
			min1 = tree[i].freq;
			minIndex1 = i;
		}else if (tree[i].freq < min2){
		min2 = tree[i].freq;
		minIndex2 = i;
		}	
	}
	return new Array(minIndex1, minIndex2);	
}


fs.readFile(arg[2], (err, data) => {
	if (err){
		console.error(err);
		return;
	}
	inputData = data.toString();
	console.log(inputData);

	for (i = 0; i < inputData.length; i++){
		alph[inputData.charAt(i)] = 0;
	}

	for (i = 0; i < inputData.length; i++){
		alph[inputData.charAt(i)]++;	
	} 

	for (i in alph){ //создаем дерево
		let n = new Node(i, alph[i], false, null, null, '');
		unusedLetters++;
		tree.push(n);	
	}		

	if (unusedLetters > 1){ //заполянем дерево, соединяя листья с двумя наименьними частотами
		for (i = unusedLetters; i > 1; i--){
			let letters = findTwoMin();
			tree[letters[0]].used = true;
			tree[letters[1]].used = true;
			let leftLetter = tree[letters[0]];
			let rightLetter = tree[letters[1]];
			tree.push(
				new Node(leftLetter.letter + rightLetter.letter,
				leftLetter.freq + rightLetter.freq,
				false,
				letters[0],
				letters[1],
				'')
				
			)
		}
		
		for (i = tree.length - 1; i > 0; i--){ //создаем коды для каждого символа
			if (tree[i].left != null && tree[i].right != null){
				tree[tree[i].left].code = tree[i].code + '0';
				tree[tree[i].right].code = tree[i].code + '1';
			}
		}
		
		for (i = 0; i < (tree.length - 1); i ++){ //создаем словарь, в котором хранятся коды каждой буквы
			if (tree[i].left == null && tree[i].right == null){
				dictionary[tree[i].letter] = [tree[i].code];
			}	
		}	
		
	}else{
		tree[0].code = '0';
		dictionary[tree[0].letter] = [tree[0].code]
	}	
	
	for (i = 0; i < inputData.length; i++){
		code += dictionary[inputData.charAt(i)];
	}
	console.log(code);
	
	for(i = 0; i < code.length; i++){
		decodeString += code[i];
		for (j in dictionary){
			if (dictionary[j] == decodeString){
				decode += j;
				decodeString = '';
			}
		}
	}
	console.log(decode);
}); 
