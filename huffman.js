let fs = require('fs');
let arg = process.argv;
let unusedLetters = 0;
let dictionary = new Array();
let alph = new Array();
let tree = new Array();
let i = 0;
let j = 0;
let newCode = '';
let decodeString = '';
let code = '';

function Node(letter, freq, used, left, right, code){
	this.letter = letter;
	this.freq = freq;
	this.used = used;
	this.left = left;
	this.right = right;
	this.code = code;
}	

function findTwoMin(){ //ищем 2 элемента с минимальными частотами
	let min1 = 1000;
	let min2 = 1000;
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


fs.readFile(arg[3], (err, data) => {
	if (err){
		console.error(err);
		return;
	}
	inputData = data.toString();

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
				dictionary.push(tree[i]);
			}	
		}	
		
	}else{
		tree[0].code = '0';
		dictionary.push(tree[0]);
	}	
	
	i = 0;
	if (arg[2] == 'code'){
		while (i < inputData.length){
			for (j in dictionary){
				if (inputData.charAt(i) == dictionary[j].letter){
					code += dictionary[j].code;
				}
			}
			i++;		
		}	
		console.log(code);
		fs.writeFileSync(arg[4], code);
	
	}else if (arg[2] == 'decode'){
		let decode = fs.readFileSync(arg[5], 'utf8');
		decode.toString();
		while (i < decode.length){
			newCode += decode.charAt(i);
			for (j in dictionary){
				if (newCode == dictionary[j].code){
					decodeString += dictionary[j].letter;
					newCode = '';
				}	
			}
			i++;
		}
		console.log(decodeString);
		fs.writeFileSync(arg[4], decodeString);
	}		
}); 