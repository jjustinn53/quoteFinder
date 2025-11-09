import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "m7nj9dclezfq7ax1.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "gre4j1gd6jvlnoii",
    password: "wx84emrijmcvzw8j",
    database: "lgcyr22okbejp03i",
    connectionLimit: 10,
    waitForConnections: true
});
const conn = await pool.getConnection();

//routes
app.get('/', async (req, res) => {
    let authorsSql = `SELECT authorId, CONCAT(firstName, ' ', lastName) AS fullName FROM authors`;
    const [authorsRows] = await conn.query(authorsSql);

    let categorySql = 'SELECT DISTINCT category FROM quotes;'
    const [categoryRows] = await conn.query(categorySql)

    res.render('home.ejs', {authorsRows, categoryRows});
});

//local API to get all info for a specific author
app.get('/api/authors/:authorId', async(req, res) => {
    let authorId = req.params.authorId; // title after req.params. must match with /api/authors/:authorId
    let sql = `SELECT *
                FROM authors 
                WHERE authorId = ?;`;

    const [rows] = await conn.query(sql, [authorId]);
    res.send(rows);
});

app.get('/searchByKeyword', async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT a.authorId, CONCAT(a.firstName, ' ', a.lastName) AS fullName, q.quote 
                FROM authors a
                NATURAL JOIN quotes q
                WHERE quote LIKE ?;`;
    let sqlParams = [`%${keyword}%`];
   
   
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results.ejs",{result: rows});
});

app.get('/searchByAuthor', async (req, res) => {
    let author = req.query.authorId;
    let sql = `SELECT a.authorId, CONCAT(a.firstName, ' ', a.lastName) AS fullName, q.quote 
                FROM authors a
                NATURAL JOIN quotes q
                WHERE a.authorId = ?;`;

    let sqlParams = [author];
   
   
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results.ejs",{result: rows});
});

app.get('/searchByCategory', async (req, res) => {
    let category = req.query.category;
    let sql = `SELECT a.authorId, CONCAT(a.firstName, ' ', a.lastName) AS fullName, q.quote 
                FROM authors a
                JOIN quotes q ON q.authorId = a.authorId 
                WHERE q.category = ?;`;

    let sqlParams = [category];
   
   
    const [rows] = await conn.query(sql, sqlParams);
    res.render("results.ejs",{result: rows});
});

app.get('/searchByLikes', async (req, res) => {
    let min = req.query.min;
    let max = req.query.max; 

    let sql = `SELECT a.authorId, CONCAT(a.firstName, ' ', a.lastName) AS fullName, q.quote, q.likes
                FROM authors a
                JOIN quotes q ON q.authorId = a.authorId 
                WHERE q.likes BETWEEN ? AND ?;`;

    let sqlParams = [min, max];
   
    const [rows] = await conn.query(sql, sqlParams);
    res.render("quotesLikes.ejs",{result: rows,});
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})

