概述

为了让程序更易用，我们兼容几种最基本的数据类型：numbers(数字)，strings(字符串)，structures(结构)，boolean(布尔值)等等。在 TypeScript 中，我们支持和 Javascript 几乎一样多的类型，并且新增了实用的枚举类型。

Boolean 布尔值

最基础的数据类型就是简单的 true(真)/false(假) ，在 Javascript 和 TypeScript （以及其他语言）中被称作是 "boolean(布尔值)"。

var isDone: boolean = false;
 

Number 数字

和 Javascript 一样，在 TypeScript 中所有的number都是浮点值。 TypeScript 除了支持ECMAScript 2015中的十六进制和十进制外，还支持二进制和二进制类型。

var decLiteral: number = 6;
var hexLiteral: number = 0x9837abdef;
var binaryLiteral: number = 0b0010;
var octalLiteral: number = 0o74563;
 

String 字符串

在使用JavaScript创建网页或应用程序时，要用到很基础的功能是处理字符串，和其他语言一样，我们使用 "string" 类型来表示那些文本数据。和 JavaScript 一样，TypeScript 也使用双引号或单引号来围绕字符串数据。

var name: string = "bob";
name = 'smith';
 

你也可以使用 模板字符串，他能支持多行文本和内嵌表达式。这些字符串使用单引号(`)包围，并且嵌入的表达式使用${ expr }这样的形式表示。

var name: string = `Gene`;
var age: number = 37;
var sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`
 

上面的表达式相当于下面的声明方式：

var sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month."
 

Array 数组

TypeScript 和 Javascript 一样，允许你使用数组。数组类型的定义可以有两种写法。第一种写法，你在数组元素类型后面添加‘[]’来表示这是一个该类型的数组:

var list: number[] = [1, 2, 3];
 

第二种写法使用一种通用的数组类型表示，Array<数组元素类型>:

var list: Array<number> = [1, 2, 3];
 

Tuple 元组

元组类型允许表达固定数量的已知类型集合，但这些类型不必是相同的。例如，您可能想表示一个'string和number`组合的类型：

复制代码
// 声明一个元组类型
var x: [string, number];
// 初始化他
x = ['hello', 10]; // 准确
// 错误的初始化
x = [10, 'hello']; // 错误
复制代码
 

我们可以使用数字检索一个已知的元素，但需要注意类型正确。

console.log(x[0].substr(1)); // 正确
console.log(x[1].substr(1)); // 错误，'number' 类型没有 'substr' 方法
 

当访问的索引超过边界时，将使用联合类型处理：

x[3] = 'world'; // 正确，string允许被分配到 (string | number)
console.log(x[5].toString()); // 正确，'string' 和 'number' 都有 toString 方法
x[6] = true; // 错误，布尔值不是 (string | number) 中的一种
 

联合类型是更高级的议题，我们会在后续的章节中介绍。

Enum 枚举

TypeScript拓展了JavaScript原生的标准数据类型集，增加了枚举类型（enum）。枚举是一种很有用的数据类型，就像C#等语言中一样，它提供了一种给数字类型的值，设置易于辨别的名字的方法。

enum Color {Red, Green, Blue};
var c: Color = Color.Green;
 

在默认情况下，枚举类型会从数字0开始标记它的元素。我们可以通过人为地设置元素的数值来改变默认值。例如，上面的例子我们可以设置成从1开始计数：

enum Color {Red = 1, Green, Blue};
var c: Color = Color.Green;
 

我们甚至可以给所有的枚举元素设置数值：

enum Color {Red = 1, Green = 2, Blue = 4};
var c: Color = Color.Green;
 

枚举类型有一个便捷特性，我们也可以直接用数值来查找其对应的枚举元素的名称。举例来说，如果我们有一个值为2,但我们不确定这个数值对应枚举类型中的哪个元素，那我们可以直接查找这个数值对应的名称：

enum Color {Red = 1, Green, Blue};
var colorName: string = Color[2];

alert(colorName);
 

Any

当我们编写应用时，我们可能会需要描述一些类型不明确的变量。因为这些变量的值可能来源于一些动态的内容，如用户或第三方提供的库。在这种情况下，我们需要略过对这些变量进行的类型检查，让它们直接通过编译时的检查。为了实现这一目的，我们可以把它们标识为'any'类型：

var notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
 

使用'any'类型是处理我们已有的JavaScript代码的一种强大的方式，我们可以用它来逐渐增加或减少在编译过程中的类型检查。 就像其他编程语言那样，你可能期望使用Object来实现这个功能，但是注意在JavaScript中，Object类型仅仅允许分配任意值给他，但不能调用他的存在或可能的任何方法：

var notSure: any = 4;
notSure.ifItExists(); // 没问题，在运行时有可能有 ifItExists 这个方法
notSure.toFixed(); // 没问题，toFixed 是真实存在的方法 (但是编译器不会验证准确性)
var prettySure: Object = 4;
prettySure.toFixed(); // 错误，不行就是不行了，使用any吧
 

当我们知道一个类型的部分数据类型，却又不确定所有的数据类型时，使用'any'可以为我们提供不少方便。比如你有一个数组，但是这个数组中的元素属于不同的数据类型，那你可以这么做：

var list: any[] = [1, true, "free"];

list[1] = 100;
 

Void

void就像any的相反面：void就是没有，any就是所有。没有返回值的函数就可以认为是'void'类型：

function warnUser(): void {
    alert("This is my warning message");
}
 

不建议声明一个变量是 void类型，因为这个变量就只能赋值undefined 或 null。

var unusable: void = undefined;