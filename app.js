const express = require('express');
const mercadopago = require('mercadopago');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()
app.use(bodyParser.json());
app.use(cors());


// Set your access token using an environment variable or directly as a string
require('dotenv').config(); // Load environment variables
mercadopago.configurations = { access_token: process.env.MERCADOTOKEN };


app.get('/', (req, res) => {
  res.send('Welcome to my Mercado Pago Integration!');
});



// Example route for creating a preference
app.post('/create_preference', async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    let preference = {
      items: [
        {
          title: 'Kaffe',  // Fixed item title
          unit_price: 100,            // Fixed price (adjust as needed)
          quantity: 1                 // Always 1
        }
      ],
      payer: {
        name: name,
        email: email,
        phone: {
          number: phone
        },
        address: {
          street_name: address
        }
      },
      back_urls: {
        success: "https://intuitive-one-021115.framer.app/success",  // Update with your success URL
        failure: "https://intuitive-one-021115.framer.app/failure",
        pending: "https://intuitive-one-021115.framer.app/pending"
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
