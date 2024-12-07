import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "iyedd",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
try{
  const result=await db.query("SELECT * FROM items order by id asc");
items=result.rows;


  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
}catch(err){
  console.log(err);
}
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("insert into items (title) values ($1)",[item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

});

app.post("/edit", async(req, res) => {
  try{
  await db.query("update items set title=($1) where id=($2)",[req.body.updatedItemTitle,req.body.updatedItemId]);
  res.redirect("/");
  }catch(err){
    console.log(err);
  }

});

app.post("/delete", async(req, res) => {
try {
  await db.query("delete from items where id=($1)",[req.body.deleteItemId]);
  res.redirect("/")
} catch (error) {
  console.log(error);
}

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
