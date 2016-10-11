var isDone = false;
var decLiteral = 6;
var hexLiteral = 0x9837abdef;
var binaryLiteral = 2;
var octalLiteral = 31091;
var name = "bob";
name = 'smith';
var list = [1, 2, 3];
var list = [1, 2, 3];
// 声明一个元组类型
var x;
// 初始化他
x = ['hello', 10]; // 准确
// 错误的初始化
x = [10, 'hello']; // 错误
console.log(x[0].substr(1)); // 正确
console.log(x[1].substr(1)); // 错误，'number' 类型没有 'substr' 方法
var name = "Gene";
var age = 37;
var sentence = "Hello, my name is " + name + ".\n\nI'll be " + (age + 1) + " years old next month.";
