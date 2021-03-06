
var Spreadsheet = (function(){

    function generateSpreadsheet(columns, rows){
      createSpreadsheet(columns, rows);
    }

    function spreadsheet(columns, rows){
        if(this instanceof spreadsheet){
            this.generateSpreadsheet(columns, rows);
            
        }else{
            return new spreadsheet(columns, rows);
        }
    }

    spreadsheet.prototype = {
        constructor: spreadsheet,
        generateSpreadsheet: function(columns, rows){
            createSpreadsheet(columns, rows);
        }
    }

    return spreadsheet;
  })();

  function creatTitle(){
    let title = "Mini Spreadsheet";
    let body = document.getElementsByTagName("body")[0];
    let br = document.createElement("br");
    let h1 = document.createElement("h1");
    body.appendChild(h1);
    h1.setAttribute("title", title);
    //h1.setAttribute("style", "text-align:left");
  }


 function createSpreadsheet(columns, rows) {
   // get the reference for the body
    let body = document.getElementsByTagName("body")[0];
    let table = document.createElement("table");
    table.setAttribute("id", "myTable");
    table.setAttribute("class", "tableStyles");
    let tableBody = document.createElement("tbody");
    let row;
    let cell;
    let cellText;
    let cellInput;
    let columnLabel;

    //Use the for loop to generate the rows and columns of the Spreadsheet
    for (let i = 0; i <= columns; i++) {
        row = document.createElement("tr");

        for (let j = 0; j < rows; j++) {

          if(i == 0 && j == 0){
            cell = document.createElement("td");
            row.appendChild(cell);
            continue;
          }

          if(j == 0){
            cell = document.createElement("td");
            cellText = document.createTextNode(i);
            cell.appendChild(cellText);
            row.appendChild(cell);
            continue;
          }

          columnLabel = generateColumnLabel(j);
          if(i == 0){
              cell = document.createElement("td");
              cellText = document.createTextNode(columnLabel);
              cell.appendChild(cellText);
              row.appendChild(cell);
              continue;
          }

          //Generate an input for each cell for store data
          let inputIdNum = columnLabel + i;
          cell = document.createElement("td");
          cellInput = document.createElement("input");
          cellInput.setAttribute("id", inputIdNum);
          cellInput.setAttribute("type", "text");
          cellInput.setAttribute("onChange", "formulaCalculation(this)");
          cell.appendChild(cellInput);
          row.appendChild(cell);
        }

        //Put the <tr> in the <tbody>
        tableBody.appendChild(row);
    }

    //Put the <tbody> in the <table>
    table.appendChild(tableBody);
    
    body.appendChild(table);
    var myTable = document.getElementById("myTable");
  }

  //Generate the column label for each column based on ASCII
  const generateColumnLabel = (i) => {
    const letterNum = 26;
    const ASCII_A = 65;
    let secondCharNum = i % letterNum;
    let firstCharNum = i / letterNum - 1;

    if (i >= letterNum) {
      return (
        String.fromCharCode(ASCII_A + firstCharNum) +
        String.fromCharCode(ASCII_A + secondCharNum)
      );
    }

    return String.fromCharCode(ASCII_A + i - 1);
  };

  //Calculate multiple cells based on the input formula
  function formulaCalculation(input) {
    let inputValue = input.value;

    if(inputValue.length == 0) return;

    inputValue = inputValue.replaceAll(" ", "");

    if(inputValue.indexOf("=") != 0) return;

    inputValue = inputValue.replace("=", "").trim();

    //Calculate the sum and difference of 2 cells
    let indexOfPlus = inputValue.indexOf("+");
    let indexOfMinus = inputValue.indexOf("-");

    if(indexOfPlus > -1){
      document.getElementById(input.id).value = sumTwoCells(inputValue);
      return;
    }

    if(indexOfMinus > -1){
      document.getElementById(input.id).value = subtractTwoCells(inputValue);
      return;
    }

    //Calculate the sum and difference of 2 cells
    let indexOfSum = inputValue.toLowerCase().indexOf("sum");
    if(indexOfSum > -1){
      let result = sumFunction(inputValue);
      if(result == -1) return;

      document.getElementById(input.id).value = result;
    }

  }

  function sumTwoCells(inputValue){
    let labels = inputValue.split("+");
    
    let firstCell = document.getElementById(labels[0].trim().toUpperCase());
    let secondCell = document.getElementById(labels[1].trim().toUpperCase());

    if(firstCell == null || secondCell == null) return;
    
    firstCell = firstCell.length == 0 ? 0 : firstCell.value;
    secondCell = secondCell.length == 0 ? 0 : secondCell.value;

    return Number(firstCell) + Number(secondCell);
  }

  function subtractTwoCells(inputValue){
    let labels = inputValue.split("-");
    
    let firstCell = document.getElementById(labels[0].trim().toUpperCase());
    let secondCell = document.getElementById(labels[1].trim().toUpperCase());

    if(firstCell == null || secondCell == null) return;
    
    firstCell = firstCell.length == 0 ? 0 : firstCell.value;
    secondCell = secondCell.length == 0 ? 0 : secondCell.value;

    return Number(firstCell) - Number(secondCell);
  }

  //Calculate the sum of all cells in the range
  function sumFunction(inputValue){
    inputValue = inputValue.toLowerCase().replace("sum", "").replace("(", "").replace(")", "").trim();

    let labels = inputValue.split(":");
    
    //Get rid of the number, get cell Labels
    let numbers = /\d+/g;
    let firstCellLabel = labels[0].replace(numbers, "").trim();
    let lastCellLabel = labels[1].replace(numbers, "").trim();

    //If two cell labels are not in the same column, stop the operation and return -1 directly
    if(firstCellLabel != lastCellLabel) return -1;

    //Get rid of cell Labels, get the number
    let chars = /[^0-9]/ig;
    let firstCellNum = labels[0].replace(chars, "");
    let lastCellNum = labels[1].replace(chars, "");

    let minCellNum = Math.min(firstCellNum, lastCellNum);
    let maxCellNum = Math.max(lastCellNum, firstCellNum);

    let sum = 0;
    let cellId;
    let cellValue;

    //Calculates the sum of all values from cellValue to lastCell
    for(let i = minCellNum; i <= maxCellNum; i++){
        cellId = (firstCellLabel + i).toUpperCase();
        cellValue = document.getElementById(cellId);
        cellValue = cellValue.length == 0 ? 0 : cellValue.value;
        sum += Number(cellValue);
    }

    return sum;
  }

  let input = document.getElementsByTagName("input");
  

  function changeToBold(){
    if(myTable.style.fontWeight != "bold"){
      document.getElementById("myTable").style.fontWeight = "bold";

      for(let i = 0; i < input.length; i++){
          if(input[i] != null)
            document.getElementsByTagName("input")[i].style.fontWeight = "bold";
      }
      return;
    }

    document.getElementById("myTable").style.fontWeight = "";

    for(let i = 0; i < input.length; i++){
        if(input[i] != null)
          document.getElementsByTagName("input")[i].style.fontWeight = "";
    }

  }

  function changeToItalics(){
    if(myTable.style.fontStyle != "italic"){
      document.getElementById("myTable").style.fontStyle = "italic";

      for(let i = 0; i < input.length; i++){
          if(input[i] != null)
            document.getElementsByTagName("input")[i].style.fontStyle = "italic";
      }
      return;
    }

    document.getElementById("myTable").style.fontStyle = "";

    for(let i = 0; i < input.length; i++){
        if(input[i] != null)
          document.getElementsByTagName("input")[i].style.fontStyle = "";
    }
  }

  function changeToUnderline(){
    if(myTable.style.textDecoration != "underline"){
      document.getElementById("myTable").style.textDecoration = "underline";

      for(let i = 0; i < input.length; i++){
          if(input[i] != null)
            document.getElementsByTagName("input")[i].style.textDecoration = "underline";
      }
      return;
    }

    document.getElementById("myTable").style.textDecoration = "";

    for(let i = 0; i < input.length; i++){
        if(input[i] != null)
          document.getElementsByTagName("input")[i].style.textDecoration = "";
    }
  }
  

  //Initialize the page and generate the Spreadsheet
  function initialing() {
    const columns = 100;
    const rows = 100;

    var spreadsheet = new Spreadsheet(columns, rows);
  }

  window.onload = initialing();
