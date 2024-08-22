var inputField = document.getElementById("input-field");
let memoryValue=0;

function showNumber(userInput){
    var currentExpression = inputField.value;
    inputField.value = currentExpression + userInput;
    memoryValue = parseFloat(inputField.value);
}

function susaLento(empty){
    inputField.value= empty;
}

function isNumber(char){
    return char >= 0 && char <= 9;
}

function isExpressionValid(expression){
    let validChars = ['+', '-', '*', '/', '.'];
    let lastChar = '';
    let decimalCount = 0;
    for(let char of expression){
        if(!isNumber(Number(char)) && !validChars.includes(char)){
            return false;    
        }
        if (char === '.') {
            if (lastChar === '.' || decimalCount > 0) {
                return false;
            }
            decimalCount++;
        } else if (['+', '-', '*', '/'].includes(char)) {
            decimalCount = 0; // Reset decimal count after an operator
        }
        lastChar = char;
    }

    return true;
}

function evaluateExpression(){
    var expression = inputField.value
    expression = expression.replaceAll(" ", "");

    if(expression.indexOf('=') > -1){
        return
    }
    
    var result = 0;

    if(isExpressionValid(expression)){
        result = eval(expression)
        memoryValue = result;
    }else{
        inputField.value = "invalid char in expression";
        return;
    }

    inputField.value  =expression + ' = '+ result;
    
}

function backspace(){
    var currentExpression = inputField.value;
    var truncated = ""
    
    if(currentExpression.indexOf('=') > -1){
        var index = currentExpression.indexOf('=');
        truncated = currentExpression.substring(0, index);
    }else{
        truncated = currentExpression.substring(0, currentExpression.length-1);
    }

    inputField.value = truncated;
    memoryValue = parseFloat(inputField.value);

}
function calculateSquareRoot(event) {
    event.preventDefault();
    const currentValue = parseFloat(inputField.value);
    if (currentValue >= 0) {
        const result = Math.sqrt(currentValue);
        inputField.value = result;
    } else {
        alert("Cannot calculate the square root of a negative number!");
    }
}

function calculatePercentage(event) {
    event.preventDefault();
    const currentValue = parseFloat(inputField.value);
    const result = currentValue / 100;
    inputField.value = result;
}



function memoryRecall() {
    inputField.value = memoryValue;
}

function memoryAdd() {
    memoryValue += parseFloat(inputField.value);
}

function memorySubtract() {
    memoryValue -= parseFloat(inputField.value);
}

