var isDone: boolean = false;

var decLiteral: number = 6;
var hexLiteral: number = 0x9837abdef;
var binaryLiteral: number = 0b0010;
var octalLiteral: number = 0o74563;

var name: string = "bob";
name = 'smith';

var list: number[] = [1, 2, 3];
var list: Array<number> = [1, 2, 3];

// 声明一个元组类型
var x: [string, number];
// 初始化他
x = ['hello', 10]; // 准确
// 错误的初始化
x = [10, 'hello']; // 错误
console.log(x[0].substr(1)); // 正确
console.log(x[1].substr(1)); // 错误，'number' 类型没有 'substr' 方法

var name: string = `Gene`;
var age: number = 37;
var sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`


var asdfqwe:number = 12;
