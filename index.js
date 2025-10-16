import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_KEY);

app.use(cors({
  origin: "https://leafy-chimera-f886e1.netlify.app/",
  credentials: true,
}));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("✅ Backend is running fine!");
});


app.post("/create-payment-intent", async (req, res) => {
  try {
    const { total } = req.body; // amount in smallest currency unit (cents)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total, // e.g. $50 = 5000
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
