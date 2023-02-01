const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const port = 8000;
const app = express();

app.use(cors());
app.use(express.json());

function readCategories() {
    const content = fs.readFileSync("categories.json");
    const categories = JSON.parse(content);
    return categories;
}

app.get("/categories", (req, res) => {
    const { q } = req.query;
    const categories = readCategories();
    if (q) {
        const filteredList = categories.filter((category) => category.name.toLowerCase().includes(q.toLowerCase()));
        res.json(filteredList);
    } else {
        res.json(categories);
    }
});

app.get("/categories/:id", (req, res) => {
    const { id } = req.params;
    const categories = readCategories();
    const one = categories.find((category) => category.id === id);
    if (one) {
        res.json(one);
    } else {
        res.sendStatus(404);
    }
});

app.post("/categories", (req, res) => {
    const { name } = req.body;
    const newCategory = { id: uuid(), name: name };

    const categories = readCategories();

    categories.unshift(newCategory);
    fs.writeFileSync("categories.json", JSON.stringify(categories));

    res.sendStatus(201);
});

app.delete("/categories/:id", (req, res) => {
    const { id } = req.params;
    const categories = readCategories();
    const one = categories.find((category) => category.id === id);
    if (one) {
        const newList = categories.filter((category) => category.id !== id);
        fs.writeFileSync("categories.json", JSON.stringify(newList));
        res.json({ deletedId: id });
    } else {
        res.sendStatus(404);
    }
});

app.put("/categories/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const categories = readCategories();
    const index = categories.findIndex((category) => category.id === id);
    if (index > -1) {
        categories[index].name = name;
        fs.writeFileSync("categories.json", JSON.stringify(categories));
        res.json({ updatedId: id });
    } else {
        res.sendStatus(404);
    }
});

app.get("/users/save", (req, res) => {
    const newUser = [
        {
            name: "Sarnai",
            id: 1,
        },
    ];
    fs.writeFileSync("data.json", JSON.stringify(newUser));
    res.json(["success"]);
});

app.get("/users/read", (req, res) => {
    const content = fs.readFileSync("data.json");
    res.json(JSON.parse(content));
});

app.get("/users/update", (req, res) => {
    const content = fs.readFileSync("data.json");
    const users = JSON.parse(content);
    users.push({ id: 2, name: "Bold" });
    fs.writeFileSync("data.json", JSON.stringify(users));
    res.json({});
});

app.listen(port, () => {
    console.log("App is listering at port", port);
});