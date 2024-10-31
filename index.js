const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Needed to parse JSON data for PATCH requests

let posts = [
  {
    id: uuidv4(),
    username: "Pramudit Shukla",
    content: "I love CODING very much",
  },
  {
    id: uuidv4(),
    username: "Shweta Shukla",
    content: "Hard work is the key to success",
  },
];

// GET route to show all posts
app.get("/posts", (req, res) => {
  res.render("index", { posts });
});

// POST route to add new posts
app.post("/posts", (req, res) => {
  const { username, content } = req.body;
  const id = uuidv4();
  posts.push({ id, username, content });
  res.redirect("/posts");
});

// GET route to render form for creating new posts
app.get("/posts/new", (req, res) => {
  res.render("new");
});

// GET route to show a specific post by ID
app.get("/posts/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => id === p.id);
  if (!post) {
    return res.status(404).send("Post not found");
  }
  res.render("show", { post });
});

// PATCH route to edit a post by ID
app.patch("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Find the post to update
  const post = posts.find((p) => p.id === id);

  // If post not found, return an error
  if (!post) {
    return res.status(404).send("Post not found");
  }

  // Update the content of the post
  post.content = content;
  res.send(`Post with ID ${id} updated successfully.`);
});

// DELETE route to remove a post by ID (optional for completeness)
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((p) => p.id === id);

  if (postIndex === -1) {
    return res.status(404).send("Post not found");
  }

  posts.splice(postIndex, 1);
  res.send(`Post with ID ${id} deleted successfully.`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
