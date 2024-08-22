// finding all the input boxes(by their id=""s) in the form and  give them a name so that we can use them later

const firstName = document.getElementById("fname");
const lastName = document.getElementById("lname");
const marks = document.getElementById("grades");
const ID = document.getElementById("pupilID");
const add = document.getElementById("yifakemntanam");
const vezgraf= document.getElementById('vezaigraf');
const khanvaaaaa= document.getElementById('studentPieChart')


// finding all the buttons(by their id=""s) in the table(thead) and  give them a name so that we can use them later


const folderBtn = document.getElementById('folder-btn');
const nestedBtns = document.getElementById('nested-btns');

// get pupils' data from localStorage(web browser)  and translate it into a js object. When the translation fails give an empty array.

const pupils = JSON.parse(localStorage.getItem('pupils')) || [];

// start a function that adds a pupil
function addPupil() {
    // check if the input boxes are empty, if they are, alert to fill in all boxes.
    if (firstName.value.trim() === '' || lastName.value.trim() === '' || ID.value.trim() === '') {
       
        return;
    }

// declare a variable named rawID and assign the value of ID.value

    const rawID = ID.value;

  // declare a variable named formattedID and assign it to rawID that is passed to the formatStudentID function
    
    const formattedID = formatStudentID(rawID);

//  checks if an input box(studentID) is empty and if it is shows a message that's telling to enter the valid ID

    if (formattedID === '') {
        alert('Please enter an ID that is within the valid range (001 to 100).');
        return;
    }
    // const fullStudentId = `MT${rawID}`;
    
    const isDuplicate = pupils.some(pupil=> pupil.ID === formattedID);
    
    
    if (isDuplicate) {  
        alert('StudentID already exists. Please enter a unique ID.')
        return;
    }
    
    // create a new pupil object with the names of the inpux boxes that I was getting; as its properties
    const pupil = {
        firstName: firstName.value,
        lastName: lastName.value,
        marks: Number(marks.value),
        ID: formattedID,
        // ID: fullStudentId,
    };

// add a new pupil object to the end of the array

    pupils.push(pupil);

// stores the the array in the local storage(web's storage)

    localStorage.setItem('pupils', JSON.stringify(pupils));

    // resets form to clear input boxes

    document.getElementById("summit").reset(); 
    updateTable();
    // calls the table to dispaly the latest pupil data
}
document.addEventListener('DOMContentLoaded', updateTable);

// adds a eventlistener to a button that i was finding earlier and gave it a name that is "add"

add.addEventListener("click", addPupil);

// a formatStudentID function is declared and it has a input parameter of rawID

function formatStudentID(rawID) {

    // checks if the ID is not within the valid range (outside of 001 and 100) and if it is not within the range, display a message that guides you to do waht you have to do
    if (rawID > 100 || rawID < 1) {
        alert('Student ID must be between 001 and 100.');
// if the ID is outside of the range exits the function and return an empty string
        return '';
    }
    
    // concatenates the prefix of the ID and the three digits
    return 'MT' + ('00' + rawID).slice(-3);
}
// create a formatMarks function with the input parameter of rawMarks
function formatMarks(rawMarks) {
    // concatenates the number(rawMarks) and the percent symbol
    return rawMarks + '%';
}


// creates a function named searchData
function searchData() {
//     declare all the variables that i'm gonna need/use on the searchData function and find/get them by their ids,tags
    // let  i, 
    const input = document.getElementById("search");
   const  filter = input.value.toUpperCase();
  const   table = document.getElementById("theybhl");
  const  tr = table.getElementsByTagName("tr");
    


// create a for loop that will iterate the table rows, start from index
    for (i = 1; i < tr.length; i++) {
       const tdID = tr[i].getElementsByTagName("td")[2];
       const tdSurname = tr[i].getElementsByTagName("td")[1];
        const tdName = tr[i].getElementsByTagName("td")[0];

    // checks if td elements exist    
        if (tdID || tdSurname || tdName) {

// gets the text content of each td element and assigns it to its corresponding    variable
          const  txtValueID = tdID.textContent || tdID.innerText;
         const   txtValueSurname = tdSurname.textContent || tdSurname.innerText;
          const  txtValueName = tdName.textContent || tdName.innerText;

// check if the search query(filter) exists within any of the avlues, convert the text values to UpperCase

            if (txtValueID.toUpperCase().indexOf(filter) > -1 || txtValueSurname.toUpperCase().indexOf(filter) > -1 || txtValueName.toUpperCase().indexOf(filter) > -1) {

//   sets the display style of the table row to an empty string, making it visible  
                tr[i].style.display = "";
            } else {
//   sets the display style of the table row to an empty string, hiding it   
                tr[i].style.display = "none";
            }
        }
    }
}


// creates a function named clearSearch
function clearSearch() {

// gets a search input and its value by id and equate it to an empty string to clear the value 
    document.getElementById("search").value = "";

    // call the search input functionality
    searchData();
}

folderBtn.addEventListener('click', () => {
    nestedBtns.style.display = nestedBtns.style.display === 'none' ? 'flex' : 'none';
});


// add an event listener to the button that listens for a click to sorts the marks 
document.getElementById('sort-marks-btn').addEventListener('click', () => {
    pupils.sort((a, b) => b.marks - a.marks);
    updateTable();
});


// This variable will keep track of the visibility state of the average row
let isAverageVisible = false;

// add an event listener to the button that listens for a click to calculate the marks' average
document.getElementById('average-btn').addEventListener('click', () => {
    const table = document.getElementById('theybhl');
    const existingAverageRow = document.querySelector('#theybhl .average-row');

    // If the average row is currently visible, remove it
    if (isAverageVisible && existingAverageRow) {
        existingAverageRow.remove();
    } else {
        // Check for valid pupil data and calculate the average
        if (!pupils.length || pupils.some(pupil => typeof pupil.marks !== 'number')) {
            alert('No pupils data available or invalid marks detected.');
            return;
        }
        const averageMarks = pupils.reduce((acc, pupil) => acc + pupil.marks, 0) / pupils.length;
        
        // Create and append the average row
        const averageRow = document.createElement('tr');
        averageRow.classList.add('average-row');
        const averageCell = document.createElement('td');
        averageCell.colSpan = 5; // Assuming there are 5 columns in the table
        averageCell.textContent = `Average: ${averageMarks.toFixed(2)}%`;
        averageRow.appendChild(averageCell);
        table.appendChild(averageRow);
    }

    // Toggle the visibility state
    isAverageVisible = !isAverageVisible;
});

let sortDescending = false;
function updateTable() {
    const table = document.getElementById('theybhl');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    pupils.forEach((pupil, index) => {
        const row = table.insertRow(-1);
        const nameCell = row.insertCell(0);
        nameCell.textContent = pupil.firstName;4
        const surnameCell = row.insertCell(1);
        surnameCell.textContent = pupil.lastName;
        const idCell = row.insertCell(2);
        idCell.textContent = pupil.ID;
        const marksCell = row.insertCell(3);
        marksCell.textContent = formatMarks(pupil.marks);
        const moreBtnCell = row.insertCell(4);
        const moreBtn = document.createElement('button');
        moreBtn.textContent = '...';
        moreBtn.style.backgroundColor= "rgb(255, 182, 193)";
        moreBtn.style.borderColor = "#FFC5C5";
        moreBtn.style.fontWeight = 'bold'; // Make text bold
        moreBtn.style.textAlign = 'center'; // Center text horizontally
        moreBtn.style.display = 'flex'; // Use flexbox for centering
        moreBtn.style.justifyContent = 'center'; // Center text horizontally
        moreBtn.style.alignItems = 'center'; // Center text vertically
        moreBtn.style.fontSize= "20px"
        moreBtn.addEventListener('click', function() {
            toggleExtendedRow(this);
        });
        moreBtnCell.appendChild(moreBtn);

});
  // Reset all rows to default color
  for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].style.color = 'black';
}

// Apply color to the highest and lowest scores if sorted by marks
if (sortDescending) {
    table.rows[1].style.color = 'green'; // Highest score
    table.rows[table.rows.length - 1].style.color = 'red'; // Lowest score
}
}

// Toggle sorting order and update table
document.getElementById('sort-marks-btn').addEventListener('click', () => {
    const sortButton = document.getElementById('sort-marks-btn');
    sortDescending = !sortDescending; // Toggle the sorting order
if (sortDescending) {
    // Sort by marks in descending order
    pupils.sort((a, b) => b.marks - a.marks);
    sortButton.style.backgroundColor = 'rgb(243, 185, 110)';
} else {
    // Sort by ID in ascending order
    pupils.sort((a, b) =>{ const idM = parseInt(a.ID.slice(2)); 
     const idT= parseInt(b.ID.slice(2));
      return idM - idT;});
      sortButton.style.backgroundColor = 'rgb(201, 160, 220)';
      
    const table = document.getElementById('theybhl');
    while (table.rows.length > 1) {
        table.deleteRow(1); // Keep the header row
}
pupils.forEach((pupil, index) => {
    const row = table.insertRow(-1);
    const nameCell = row.insertCell(0);
    nameCell.textContent = pupil.firstName;
    const surnameCell = row.insertCell(1);
    surnameCell.textContent = pupil.lastName;
    const idCell = row.insertCell(2);
    idCell.textContent = pupil.ID;
    const marksCell = row.insertCell(3);
    marksCell.textContent = formatMarks(pupil.marks);
    const moreBtnCell = row.insertCell(4);
    const moreBtn = document.createElement('button');
    moreBtn.textContent = '...';
    moreBtn.addEventListener('click', function() {
        toggleExtendedRow(this);
    });
    moreBtnCell.appendChild(moreBtn);
    
});

// Reset all rows to default color
for (let i = 1; i < table.rows.length; i++) {
    table.rows[i].style.color = 'black';
}}
updateTable();
});
function toggleExtendedRow(btn) {
    const row = btn.parentNode.parentNode;
    if (btn.isExtended) {
        row.parentNode.deleteRow(row.rowIndex + 1);
        btn.isExtended = false;
    } else {
        const extendedRow = row.parentNode.insertRow(row.rowIndex + 1);
        const extendedCell = extendedRow.insertCell(0);
        extendedCell.colSpan = "5";
        extendedCell.innerHTML = `
            <button style="background-color: red;" onclick="removeStudent(this)">Remove</button>
            <button style="background-color: #C9A0DC;" onclick="updateStudent(this)">Update</button>
        `;
        extendedCell.style.textAlign = 'center';
        btn.isExtended = true;
    }
}

document.addEventListener('DOMContentLoaded', loadPupils);

function loadPupils() {
    const storedPupils = localStorage.getItem('pupils');
    if (storedPupils) {
        pupils = JSON.parse(storedPupils);
        const table = document.getElementById('pupilsTable');
        table.innerHTML = ''; // Clear the table first

        pupils.forEach((pupil, index) => {
            const row = table.insertRow();
            row.insertCell(0).innerHTML = pupil.firstName;
            row.insertCell(1).innerHTML = pupil.lastName;
            row.insertCell(2).innerHTML = pupil.ID;
            row.insertCell(3).innerHTML = formatMarks(pupil.marks);
            const updateCell = row.insertCell(4);
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.style.backgroundColor = '#C9A0DC';
            updateButton.onclick = function() {
                updateStudent(this);
            };
            updateCell.appendChild(updateButton);
        });
    }
}

function updateStudent(btn) {
    const row = btn.parentNode.parentNode.previousSibling; // Get the original row

    const nameCell = row.cells[0];
    const surnameCell = row.cells[1];
    const marksCell = row.cells[3];
    const studentCell = row.cells[2];

    // Create input fields for editing
    nameCell.innerHTML = `<input type="text" value="${nameCell.innerHTML}">`;
    surnameCell.innerHTML = `<input type="text"  value="${surnameCell.innerHTML}">`;
    marksCell.innerHTML = `<input type="number" min="0" max="100" value="${marksCell.innerHTML.replace('%', '')}">`;
    studentCell.innerHTML = `<input type="text" min="1" max="100" value="${studentCell.innerHTML.replace('MT', '')}">`;

    // Change the Update button to Save button
    btn.textContent = 'Save';
    btn.style.backgroundColor = '#FFF5D0';
    btn.onclick = function() {
        saveStudent(this);
    };
}

function saveStudent(btn) {
    const row = btn.parentNode.parentNode.previousSibling; // Get the original row

    const nameCell = row.cells[0];
    const surnameCell = row.cells[1];
    const marksCell = row.cells[3];
    const studentCell = row.cells[2];

    // Save the new values
    const newName = nameCell.querySelector('input').value;
    const newSurname = surnameCell.querySelector('input').value;
    const newMarks = marksCell.querySelector('input').value;
    const newStudentID = studentCell.querySelector('input').value;
    if (!/^\d{3}$/.test(newStudentID) || newStudentID < '001' || newStudentID > '100') {
        alert('Student ID must be a number between 001 and 100.');
        return;
    }

    const formattedStudentID = `MT${newStudentID}`;
    const existingIndex = pupils.findIndex(pupil => pupil.ID === formattedStudentID);
    if (existingIndex !== -1 && existingIndex !== row.rowIndex - 1) {
        alert('Student ID already exists.');
        return;
    }

    nameCell.innerHTML = newName;
    surnameCell.innerHTML = newSurname;
    marksCell.innerHTML = formatMarks(newMarks);
    studentCell.innerHTML = formattedStudentID;

    // Update the pupil data
    const index = pupils.findIndex(pupil => pupil.ID === studentCell.innerHTML);
    if (index !== -1) {
        pupils[index].firstName = newName;
        pupils[index].lastName = newSurname;
        pupils[index].marks = Number(newMarks);
        pupils[index].ID = formattedStudentID;
        localStorage.setItem('pupils', JSON.stringify(pupils));
    }

    // Change the Save button back to Update button
    btn.textContent = 'Update';
    btn.style.backgroundColor = '#C9A0DC';
    btn.onclick = function() {
        updateStudent(this);
    };
}

function formatMarks(marks) {
    return `${marks}%`;
}

function formatStudentID(id) {
    return `MT${id}`;
}

function removeStudent(btn) {
    const row = btn.parentNode.parentNode;
    const studentID = row.previousSibling.cells[2].textContent;
    const index = pupils.findIndex(pupil => pupil.ID === studentID);
    if (index !== -1) {
        pupils.splice(index, 1);
        localStorage.setItem('pupils', JSON.stringify(pupils));
        updateTable();
    }
}

function toggleCalculator() {
    const calculator = document.getElementById('calculator');
    const mathText = document.getElementById('mathText');
    if (calculator.style.display === 'none') {
        calculator.style.display = 'block';
        mathText.classList.add('small-font');
    } else {
        calculator.style.display = 'none';
        mathText.classList.remove('small-font');
    }
}
// Sample data for demonstration purposes


// Save sample data to localStorage for demonstration
localStorage.setItem('pupils', JSON.stringify(pupils));

function toggleTableVisibility() {
    const table = document.getElementById('theybhl');
    const toggleButton = document.getElementById('toggle-table-btn');
    if (table.style.display === 'none' || table.style.display === '') {
        table.style.display = 'table';
        toggleButton.textContent = 'HIDE TABLE';
    } else {
        table.style.display = 'none';
        toggleButton.textContent = 'SHOW TABLE';
    }
}

// Event listener for the toggle button
document.getElementById('toggle-table-btn').addEventListener('click', toggleTableVisibility);

// Load the table with pupil data when the page loads

document.addEventListener('DOMContentLoaded', () => {
    updateTable();
    // Ensure the table is visible and button text is correct on page load
    document.getElementById('theybhl').style.display = 'table';
    document.getElementById('toggle-table-btn').textContent = 'HIDE TABLE';
});

// // Function to show the chart
// function showChart() {
//     // Retrieve student data from localStorage
//     const storedPupils = JSON.parse(localStorage.getItem('pupils'));

//     // Initialize counters for each percentage range
//     const ranges = [0, 0, 0, 0, 0];

//     storedPupils.forEach(pupil => {
//         if (pupil.marks <= 20) {
//             ranges[0]++;
//         } else if (pupil.marks<= 40) {
//             ranges[1]++;
//         } else if (pupil.marks<= 60) {
//             ranges[2]++;
//         } else if (pupil.marks<= 80) {
//             ranges[3]++;
//         } else if (pupil.marks<= 100) {
//             ranges[4]++;
//         }
//     });

//     // Create the pie chart
//     new Chart("studentPieChart", {
//         type: "pie",
//         data: {
//             labels: ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"],
//             datasets: [{
//                 backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//                 data: ranges
//             }]
//         },
//         options: {
//             title: {
//                 display: true,
//                 text: "Student Percentage Distribution"
//             }
//         }
//     });

//     // Display the canvas
//     khanvaaaaa.style.display = 'block';
// }

// // Add event listener to the button
// vezgraf.addEventListener('click', showChart);


function updateChart() {
    // Retrieve student data from localStorage
    const storedPupils = JSON.parse(localStorage.getItem('pupils')) || [];

    // Initialize counters for each percentage range
    const ranges = [0, 0, 0, 0, 0];

    storedPupils.forEach(pupil => {
        if (pupil.marks <= 20) {
            ranges[0]++;
        } else if (pupil.marks <= 40) {
            ranges[1]++;
        } else if (pupil.marks <= 60) {
            ranges[2]++;
        } else if (pupil.marks <= 80) {
            ranges[3]++;
        } else if (pupil.marks <= 100) {
            ranges[4]++;
        }
    });

    // Create or update the pie chart
    const ctx = document.getElementById('studentPieChart').getContext('2d');
    if (window.studentChart) {
        window.studentChart.data.datasets[0].data = ranges;
        window.studentChart.update();
    } else {
        window.studentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"],
                datasets: [{
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                    data: ranges
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Student Percentage Distribution"
                }
            }
        });
    }
}

// Function to toggle the visibility of the chart and update button text
function toggleChartVisibility() {
    const chart = document.getElementById('studentPieChart');
    const toggleButton = document.getElementById('toggle-chart-btn');
    if (chart.style.display === 'none' || chart.style.display === '') {
        chart.style.display = 'block';
        toggleButton.textContent = 'HIDE CHART';
    } else {
        chart.style.display = 'none';
        toggleButton.textContent = 'SHOW CHART';
    }
}

// Event listener for the toggle chart button
document.getElementById('toggle-chart-btn').addEventListener('click', toggleChartVisibility);

// Function to update the table with pupil data
function updateTable() {
    const table = document.getElementById('theybhl');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    pupils.forEach((pupil, index) => {
        const row = table.insertRow(-1);
        const nameCell = row.insertCell(0);
        nameCell.textContent = pupil.firstName;
        const surnameCell = row.insertCell(1);
        surnameCell.textContent = pupil.lastName;
        const idCell = row.insertCell(2);
        idCell.textContent = pupil.ID;
        const marksCell = row.insertCell(3);
        marksCell.textContent = formatMarks(pupil.marks);
        const moreBtnCell = row.insertCell(4);
        const moreBtn = document.createElement('button');
        moreBtn.textContent = '...';
        moreBtn.style.backgroundColor = 'rgb(255, 182, 193)';
        moreBtn.style.borderColor = '#FFC5C5';
        moreBtn.style.fontWeight = 'bold'; // Make text bold
        moreBtn.style.textAlign = 'center'; // Center text horizontally
        moreBtn.style.display = 'flex'; // Use flexbox for centering
        moreBtn.style.justifyContent = 'center'; // Center text horizontally
        moreBtn.style.alignItems = 'center'; // Center text vertically
        moreBtn.style.fontSize = '20px';
        moreBtn.addEventListener('click', function() {
            toggleExtendedRow(this);
        });
        moreBtnCell.appendChild(moreBtn);
    });

    // Reset all rows to default color
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].style.color = 'black';
    }

    // Apply color to the highest and lowest scores if sorted by marks
    if (sortDescending) {
        table.rows[1].style.color = 'green'; // Highest score
        table.rows[table.rows.length - 1].style.color = 'red'; // Lowest score
    }

    // Update the chart whenever the table is updated
    updateChart();
}

// Function to add a pupil
function addPupil() {
    // Check if the input boxes are empty, if they are, alert to fill in all boxes.
    if (firstName.value.trim() === '' || lastName.value.trim() === '' || ID.value.trim() === '') {
        alert('Please fill in all boxes.');
        return;
    }

    // Declare a variable named rawID and assign the value of ID.value
    const rawID = ID.value;

    // Declare a variable named formattedID and assign it to rawID that is passed to the formatStudentID function
    const formattedID = formatStudentID(rawID);

    // Checks if an input box (studentID) is empty and if it is shows a message that's telling to enter the valid ID
    if (formattedID === '') {
        alert('Please enter an ID that is within the valid range (001 to 100).');
        return;
    }

    const isDuplicate = pupils.some(pupil => pupil.ID === formattedID);

    if (isDuplicate) {
        alert('StudentID already exists. Please enter a unique ID.');
        return;
    }

    // Add the new pupil to the pupils array
    pupils.push({
        firstName: firstName.value,
        lastName: lastName.value,
        ID: formattedID,
        marks: marks.value
    });

    // Save the updated pupils array to localStorage
    localStorage.setItem('pupils', JSON.stringify(pupils));

    // Update the table with the new pupil data
    updateTable();

    // Clear the input fields
    firstName.value = '';
    lastName.value = '';
    ID.value = '';
    marks.value = '';
}


document.addEventListener('DOMContentLoaded', () => {
    updateTable();

    document.getElementById('theybhl').style.display = 'table';
    document.getElementById('toggle-table-btn').textContent = 'HIDE TABLE';
});


add.addEventListener('click', addPupil);

document.getElementById('toggle-legend').addEventListener('click', function() {
    const legend = document.getElementById('legend');
    if (legend.style.display === 'none' || legend.style.display === '') {
        legend.style.display = 'block';
        this.textContent = 'Hide Legend';
    } else {
        legend.style.display = 'none';
        this.textContent = 'Show Legend';
    }
});