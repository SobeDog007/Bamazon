// Steven Sober
// 09-14-2017
// Homework - Bamazon
// bamazonManager.js

// Required modules:
var mysql        = require("mysql");
var inquirer     = require("inquirer");
var consoleTable = require("console.table");

// Open the connection to the database.
var connection = mysql.createConnection({
  	host: "localhost",
  	port: 3306,
  	user: "root",
  	password: "root",
  	database: "bamazon_db"
});

// Start the connection and run the necessary queries.
connection.connect(function(err) {
	
	if (err) {
   	console.error('error connecting: ' + err.stack);
    	return;
  	}
 
  	console.log("\nConnected as ID: " + connection.threadId + "\n");

  	// Handles all manager action logic.
  	runManagerActions();

});

// ***************************************************************************
// Handles manager actions
// ***************************************************************************
function runManagerActions() {

  	// Prompt the user with a menu of available actions.
	inquirer.prompt([
   {
      type: "list",
      message: "Manager Options?",
      choices: ["View Products for Sale", 
      			 "View Low Inventory", 
      			 "Add to Inventory", 
      			 "Add New Product",
      			 "Quit"],
      name: "manager_actions"
   }

	]).then(function(response) {

  		switch (response.manager_actions)
  		{
  			case "View Products for Sale":

  				printProductList();
  				break;

  			case "View Low Inventory":

  				printLowInventory();
  				break;

  			case "Add to Inventory":

  				addToInventory();
  				break;

  			case "Add New Product":

  				addNewProduct();
  				break;

  			case "Quit":
  			default:

  				connection.end();
  		}
	});
}

// ***************************************************************************
// Displays the full product list.
// ***************************************************************************
function printProductList() {

   // Build the SQL query.
  	var query = connection.query(
  		"SELECT * FROM products", 
  		function(e, response) {

  		if (e) throw e;

  		// Log the full update query.
  		console.log("\nFull Query: " + query.sql);

  		// Log the product list.
  		console.log("");
  		console.table(response);

  		runManagerActions();
  	});
}

// ***************************************************************************
// Displays the list of products with inventory of five or less.
// ***************************************************************************
function printLowInventory() {

   // Build the SQL query.
  	var query = connection.query(
  		"SELECT * FROM products where stock_quantity <= 5", 
  		function(e, response) {

  		if (e) throw e;

  		// Log the full update query.
  		console.log("\nFull Query: " + query.sql);

  		console.log("");
  		console.table(response);

  		runManagerActions();
  	});
}

// ***************************************************************************
// Updates the inventory quantity for a product.
// ***************************************************************************
function addToInventory() {

	// Prompt the user for a product to update.
   inquirer.prompt([
   {
      name: "product",
      message: "Which product's inventory should be updated (use item ID)?"
   },{
   	name: "quantity",
   	message: "New inventory value?"
   }

   ]).then(function(answers) {

   	// Build the SQL query.
   	var query = connection.query(
   		"UPDATE products SET ? WHERE ?",
   		[
				{
        			stock_quantity: answers.quantity
      		},
      		{
        			item_id: answers.product
      		}
   		],

   		function(e, response) {

  				if (e) throw e;

		  		// Log the full query.
  				console.log("\nFull Query: " + query.sql);

		  		// Notify the user of the update to inventory.
		  		console.log("\nInventory of Product ID # " + 
		  			          answers.product + 
		  			          " updated to " + answers.quantity + ".\n");

  				runManagerActions();
  			}
  		);
  	});
}

// ***************************************************************************
// Add a new product to the product list.
// ***************************************************************************
function addNewProduct() {

	// Prompt the user for the new product information.
   inquirer.prompt([
   {
      name: "product",
      message: "What is the new product's name?"
   },{
   	name: "deptName",
   	message: "What is the new product's department?"
   },{
   	name: "price",
   	message: "What is the new product's price?"
   },{
   	name: "quantity",
   	message: "What is the new product's quantity?"
   }

   ]).then(function(answers) {

   	// Build the SQL query.
  		var query = connection.query(
  			"INSERT into products (product_name, department_name, price, " + 
  				"stock_quantity) VALUES ('" + answers.product + "', '" + 
  				answers.deptName + "', " + answers.price + ", " +
  				answers.quantity + ");", 
  			function(e, response) {

  				if (e) throw e;

		  		// Log the full query.
		  		console.log("");
  				console.log("Full Query: " + query.sql);

		  		// Notify the user of the update to product list.
		  		console.log("\nNew item " + answers.product + 
		  						" added to product list.\n");

  				runManagerActions();
  			}
  		);
  	});
}