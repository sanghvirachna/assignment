const client = require("./connection");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.listen(8080, () => {
  console.log("Server is running on port 3000");
});
client.connect();

//Features


//1.Create a new invoice
app.post("/invoices", async (req, res) => {
  const { id, customer_id, items } = req.body;   await client.query("BEGIN");

  try {
   
    const invoiceRes = await client.query(
      "INSERT INTO invoices (id,customer_id, status) VALUES ($1, $2,$3) RETURNING id",
      [id, customer_id, "Pending"]
    );
    const invoiceId = invoiceRes.rows[0].id;

   
    let total = 0;
   
    const idRes = await client.query(
      "SELECT MAX(id) as max_id FROM invoice_items"
    );
    let itemId = idRes.rows[0].max_id || 0;

    for (const item of items) {
      itemId++; 
      await client.query(
        "INSERT INTO invoice_items (id, invoice_id, item_name, quantity, price) VALUES ($1, $2, $3, $4, $5)",
        [itemId, invoiceId, item.item_name, item.quantity, item.price]
      );
    }

    
    await client.query("UPDATE invoices SET total = $1 WHERE id = $2", [
      total,
      invoiceId,
    ]);

    
    await client.query("COMMIT");

    res.send({ invoiceId });
  } catch (err) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    res.status(500).send(err.toString());
  }
});


//2.Retrieve an invoice including customer and items
app.get("/invoices/:id", async (req, res) => {
  const { id } = req.params;

  try {
   
    const invoiceRes = await client.query(
      "SELECT * FROM invoices WHERE id = $1",
      [id]
    );
    const invoice = invoiceRes.rows[0];

   
    const customerRes = await client.query(
      "SELECT * FROM customers WHERE id = $1",
      [invoice.customer_id]
    );
    invoice.customer = customerRes.rows[0];

    
    const itemsRes = await client.query(
      "SELECT * FROM invoice_items WHERE invoice_id = $1",
      [id]
    );
    invoice.items = itemsRes.rows;

    res.send(invoice);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});


// 3.Update invoice status form pending to paid and vice versa.
app.put("/invoices/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await client.query("UPDATE invoices SET status = $1 WHERE id = $2", [
      status,
      id,
    ]);
    res.send({ id, status });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// 4.List invoices for a customer including total amount and status for each invoice
app.get("/customers/:id/invoices", async (req, res) => {
  const { id } = req.params;

  try {
    const invoicesRes = await client.query(
      "SELECT * FROM invoices WHERE customer_id = $1",
      [id]
    );
    res.send(invoicesRes.rows);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

//5. Calculate total sales for a customer
app.get("/customers/:id/total_sales", async (req, res) => {
  const { id } = req.params;

  try {
    const totalSalesRes = await client.query(
      "SELECT SUM(total) as total_sales FROM invoices WHERE customer_id = $1",
      [id]
    );
    res.send(totalSalesRes.rows[0]);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
module.exports = app;