const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const promisemysql = require("promise-mysql");



const sqlconnection = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "hassan12",
  database: "uob"
}


const connection = mysql.createConnection(sqlconnection);



connection.connect((err) => {
  if (err) throw err;

  console.log("Database connection successfully ");
 runEmployeeDB();
});

// all prompt functions
function runEmployeeDB(){
console.log("EMPLOYEE-SYSTEM")


    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do today?",
    name: "action",
    choices: [
            "View All Employees", 
            "View All Departments",
            "View All Roles",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Exit"
            ]
    }
]).then(function(answers) {
        switch (answers.action) {
          case "View All Employees":
                viewAllEmployees();
            break;
            case "View All Departments":
               viewAllDepartment();
            break;

            case "View All Roles":
                viewAllRole();
            break;
        
            case "Add Department":
                addDepartment();
            break;

            case "Add Role":
                addRole();
            break;

            case "Add Employee":
               addNewEmployee();
            break;

            case "Update Employee Role":
                updateEmployeeRole();
            break;
            case "Exit":
                console.log ("   DATABASE SHUTDOWN   ");
                connection.end();
            break;
            }
    })
};

function viewAllEmployees() {
    
    connection.query("SELECT employees.first_Name AS FirstName, employees.last_Name AS LastName, role.title AS Title, role.salary AS Salary, department.name AS Department, CONCAT(e.first_Name, ' ' ,e.last_Name) AS Manager FROM employees INNER JOIN role on role.id = employees.role_ID INNER JOIN department on department.id = role.department_ID LEFT JOIN employees e on employees.manager_ID = e.id;", 
    function(err, res) {
      if (err) throw err
      console.log("EMPLOYEES");
      console.table(res)
      runEmployeeDB()
  })
}

function viewAllDepartment() {
    connection.query("SELECT department.id AS ID, department.name AS Department FROM department",
    function(err, res) {
      if (err) throw err
      console.table(res)
      runEmployeeDB()
  })
}

function viewAllRole() {
    connection.query("SELECT role.id AS Dept_ID, role.title AS Title FROM role",
    function(err, res) {
      if (err) throw err
      console.table(res)
      runEmployeeDB()
  })
}

// add new department 

function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add? "
        },
        {
            name: "id",
            type: "input",
            message: "Department ID number? "
          }

    ]).then(function(answers) {
        connection.query("INSERT INTO department SET ? ",
            {
              name: answers.name,
              id: answers.id
            },
            function(err, res) {
                if (err) throw err
                console.table(res);
                runEmployeeDB();
            }
        )
    })
  }
// add new Employeee

  function addNewEmployee() { 
 
  
    let allRoles = [];
    let rolesmanager = [];
  
    
    promisemysql.createConnection(sqlconnection
    ).then((conn) => {
  
       
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employees.id, concat(employees.first_name, ' ' ,  employees.last_name) AS Employees FROM employees ORDER BY Employees ASC")
        ]);
    }).then(([roles, managers]) => {
  
        for (i=0; i < roles.length; i++){
            allRoles.push(roles[i].title);
        }
  
  
        for (i=0; i < managers.length; i++){
            rolesmanager.push(managers[i].Employees);
        }
  
        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {
  
      
        rolesmanager.unshift('--');
  
        inquirer.prompt([
            {
            
                name: "firstName",
                type: "input",
                message: "First name: ",
                
            },
            {
                
                name: "lastName",
                type: "input",
                message: "Lastname name: ",
            
            },
            {
              
                name: "role",
                type: "list",
                message: "Employee's Role?",
                choices: allRoles
            },{
                
                name: "manager",
                type: "list",
                message: "Write the new employee's manager",
                choices: rolesmanager
            }]).then((answer) => {
  
               
                let roleID;
                let managerID = null;
  
             
                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }
  
                
                for (i=0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employees){
                        managerID = managers[i].id;
                    }
                }
  
              
                connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;
  
                
                    console.log(` NEW EMPLOYEE ADDED SUCCESSFULLY `);
                  runEmployeeDB();
                });
            });
    });
  } 

// Add new role


  function addRole() {
  connection.query('SELECT * FROM department', function(err, res) {
    if (err) throw err;

    inquirer 
    .prompt([
        {
            name: 'new_role',
            type: 'input', 
            message: "What new role would you like to add?"
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this role? (Enter a number)'
        },
        {
            name: 'Department',
            type: 'list',
            choices: function() {
                var deptArry = [];
                for (let i = 0; i < res.length; i++) {
                deptArry.push(res[i].name);
                }
                return deptArry;
            },
        }
    ]).then(function (answer) {
        let department_id;
        for (let a = 0; a < res.length; a++) {
            if (res[a].name == answer.Department) {
                department_id = res[a].id;
            }
        }

        connection.query(
            'INSERT INTO role SET ?',
            {
                title: answer.new_role,
                salary: answer.salary,
                department_id: department_id
            },
            function (err, res) {
                if(err)throw err;
                console.log('BEW ROLE ADDEDD');
                console.table('All Roles:', res);
               runEmployeeDB();
            })
    })
})
};

// Update Employee

function updateEmployeeRole() {
    inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the employee's ID you want to be updated",
        name: "updateEmploy"
      },
      {
        type: "input",
        message: "Enter the new role ID for that employee",
        name: "newRole"
      }
    ])
    .then(function (res) {
        const updateEmploy = res.updateEmploy;
        const newRole = res.newRole;
        const queryUpdate = `UPDATE employees SET role_id = "${newRole}" WHERE id = "${updateEmploy}"`;
        connection.query(queryUpdate, function (err, res) {
          if (err) {
            throw err;
          }
          console.table(res);
          runEmployeeDB();
        })
      });
    }
  