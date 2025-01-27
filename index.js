import express, { json } from "express";
import cors from "cors";
import joi from "joi";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

const validateSchema = joi.object({
  id: joi.string().required("id is required"),
  firstName: joi.string().required("id is required"),
  lastName: joi.string().required("id is required"),
  department: joi.string().required("id is required"),
  email: joi.string().required("id is required"),
});

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.post("/users", (req, res) => {
  const body = req.body;
  const updatedData = { ...body, id: nanoid() };
  const valdate = validateSchema.validate(updatedData);
  if (valdate.error) {
    const errorMessage = valdate.error.details[0].message;
    return res.status(400).json({ error: errorMessage });
  }
  users.push(updatedData);
  res.send(updatedData);
});

app.put("/users", (req, res) => {
  const data = req.body;
  const updatedData = users.map((item) => {
    if (item.id === data.id) {
      return data;
    } else {
      return item;
    }
  });
  users.length = 0;
  users.push(...updatedData);
  res.send(data);
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const updatedData = users.filter((item) => item.id !== id);
  const check = users.find((item) => item.id === id);
  if (!check) {
    res.status(400).send("something went wrong,user not found");
  } else {
    users.length = 0;
    users.push(...updatedData);
    res.send("Item deleted Successfully");
  }
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, we could not find that Path!");
  res.status(500).send("Something gone Wrong!");
});
app.listen(4000, console.log("Port is running on 4000"));
