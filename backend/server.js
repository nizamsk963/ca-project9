const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const Client = require("./models/Client");
const Invoice = require("./models/Invoice");
const GstRecord = require("./models/GstRecord");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/clientDB")
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("CA Project Backend Working");
});

const TOKEN_SECRET = process.env.TOKEN_SECRET || "ca-project-local-secret";

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, hash] = storedHash.split(":");
  const attemptedHash = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(attemptedHash));
};

const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    exp: Date.now() + 1000 * 60 * 60 * 24
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
};

const authRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

    if (!token) {
      return res.status(401).json({ error: "Login required" });
    }

    const [body, signature] = token.split(".");
    const expectedSignature = crypto.createHmac("sha256", TOKEN_SECRET).update(body).digest("base64url");

    if (!body || !signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (user.exp < Date.now()) {
      return res.status(401).json({ error: "Session expired" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password)
    });

    const token = createToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/auth/me", authRequired, async (req, res) => {
  res.json({ user: req.user });
});

app.post("/auth/logout", authRequired, async (req, res) => {
  res.json({ message: "Logged out" });
});

app.get("/dashboard", authRequired, async (req, res) => {
  try {
    const [clients, invoices, gstPending, unpaidInvoices] = await Promise.all([
      Client.countDocuments(),
      Invoice.countDocuments(),
      GstRecord.countDocuments({ status: "Pending" }),
      Invoice.countDocuments({ status: "Unpaid" })
    ]);

    const totals = await Invoice.aggregate([
      { $group: { _id: null, revenue: { $sum: "$amount" }, taxCollected: { $sum: "$tax" } } }
    ]);

    res.json({
      clients,
      invoices,
      gstPending,
      unpaidInvoices,
      revenue: totals[0]?.revenue || 0,
      taxCollected: totals[0]?.taxCollected || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/add-client", authRequired, async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/clients", authRequired, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/clients/:id", authRequired, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/clients/:id", authRequired, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/invoices", authRequired, async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/invoices", authRequired, async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/invoices/:id", authRequired, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/invoices/:id", authRequired, async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/gst", authRequired, async (req, res) => {
  try {
    const record = await GstRecord.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/gst", authRequired, async (req, res) => {
  try {
    const records = await GstRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/gst/:id", authRequired, async (req, res) => {
  try {
    const record = await GstRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/gst/:id", authRequired, async (req, res) => {
  try {
    await GstRecord.findByIdAndDelete(req.params.id);
    res.json({ message: "GST record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Running");
});