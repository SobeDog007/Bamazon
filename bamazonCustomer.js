// Steven Sober
// 09-14-2017
// Homework - Bamazon
// bamazonCustomer.js

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

  	// Display all of the current products from the database.
  	var response = printProductList();
});

// ***************************************************************************
// Displays the full product list.
// ***************************************************************************
function printProductList() {

  	connection.query("SELECT * FROM products", function(e, response) {

  		if (e) throw e;

  		console.table(response);

  		// Prompt the user for a product to buy and update the database.
		getInputAndUpdate(response);
  	});
}

// ***************************************************************************
// Gathers user input and updates the database if applicable.
// ***************************************************************************
function getInputAndUpdate(response) {

	// Prompt the user for a product and quantity to purchase.
   inquirer.prompt([
   {
      name: "product",
      message: "What is the ID of the product would you like to buy?"
   }/*, {
      name: "quantity",
      message: "How many would you like to buy?"
   }*/

   ]).then(function(answers) {

   	// User requests to quit the application.
   	if (answers.product === 'q')
   	{
   		connection.end();
   	}

   	else
   	{
   		var productFound = false;

	   	// Get the quantity for the specified item ID.
	   	for (var i = 0; i < response.length; i++)
	   	{
	   		// When comparing the item_id to the user product input, remember
	   		// to convert the input to an integer from a string.
	         if (response[i].item_id === parseInt(answers.product))
	         {
	         	productFound = true;

	         	var currentQuantity = response[i].stock_quantity;

         	   inquirer.prompt([
				   {
				      name: "quantity",
				      message: "How many would you like to buy?"
				   }

				   ]).then(function(qAnswer) {

		         	// If there is enough quantity in stock, update the database.
		         	if (currentQuantity >= qAnswer.quantity)
		         	{
		         		updateProduct(response[i].product_name, 
		         						  currentQuantity - qAnswer.quantity);

		         		var totalCost = qAnswer.quantity * response[i].price;

		         		console.log("\nYour total is $" + totalCost + ".\n");

		         		// Print the updated product list.
		         		printProductList();
		         	}

		         	// Otherwise, notify the user and re-prompt for input.
		         	else
		         	{
		         		console.log("\nInsufficient Quantity!\n");

		         		getInputAndUpdate(response);
		         	}
		         });

		         break;
	         }
	   	}

	   	// If productFound is still false then the entered product ID was 
	   	// not found.  Re-prompt user for a valid product ID.
	   	if (productFound === false)
	   	{
	   		console.log("\nInvalid Product ID!\n");

	   		getInputAndUpdate(response);
	   	}
	   }
 	});
}

// ***************************************************************************
// Updates the database quantity for the specified product.
// ***************************************************************************
function updateProduct(name, number) {

  	console.log("\nUpdating quantity of " + name + "...\n");

  	var query = connection.query(
    	"UPDATE products SET ? WHERE ?",
    	[
      	{
        		stock_quantity: number
      	},
      	{
        		product_name: name
      	}
   	],

    	function(err, res) {}
  	);

  	// Console log the full update query.
  	console.log(query.sql);
}
