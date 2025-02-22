const express = require("express");
const app = express(); // variable app runs express
const cors = require("cors");
const pool = require("./db"); // add to connect to database


// middleware
app.use(cors());
app.use(express.json()); // <-- allows us to access request.body
    // when building fullstack application, need data from client side
    // only way to get data from client side is from request body object

// ROUTES

// student routes

// 1 - create a student
app.post("/students", async (req, res) => {
    try {
      const { username, email, first_name, last_name, password, university_id, major_id, grade_level, expected_graduation_date, resume_url, bio } = req.body;
      const newStudent = await pool.query(
        "INSERT INTO students (username, email, first_name, last_name, password, university_id, major_id, grade_level, expected_graduation_date, resume_url, bio) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [username, email, first_name, last_name, password, university_id, major_id, grade_level, expected_graduation_date, resume_url, bio]
      );
  
      res.json(newStudent.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

// 2 - get all students
app.get("/students", async (req, res) => {
    try {
      const allStudents = await pool.query("SELECT * FROM students");
      res.json(allStudents.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

// 3 - get a single student using id
app.get("/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const student = await pool.query("SELECT * FROM students WHERE student_id = $1", [id]);
  
      if (student.rows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json(student.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
  

// 4 - update a student
app.put("/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, first_name, last_name, password, university_id, major_id, grade_level, expected_graduation_date, resume_url, bio } = req.body;
      const updateStudent = await pool.query(
        "UPDATE students SET username = $1, email = $2, first_name = $3, last_name = $4, password = $5, university_id = $6, major_id = $7, grade_level = $8, expected_graduation_date = $9, resume_url = $10, bio = $11 WHERE student_id = $12 RETURNING *",
        [username, email, first_name, last_name, password, university_id, major_id, grade_level, expected_graduation_date, resume_url, bio, id]
      );
  
      if (updateStudent.rows.length === 0) { // error checking: trying to update a student that doesn't exist
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json(updateStudent.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

// 5 - delete a student
app.delete("/students/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleteStudent = await pool.query("DELETE FROM students WHERE student_id = $1 RETURNING *", [id]);
  
      if (deleteStudent.rows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }
  
      res.json({ message: "Student was deleted!" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

// 6 - get student's connections
app.get("/students/:id/connections", async (req, res) => {
    try {
        const { id } = req.params;
        const connections = await pool.query(
            "SELECT * FROM connections WHERE requester_id = $1 OR receiver_id = $1",
            [id]
        );

        res.json(connections.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 7 - get student's mentorship requests
app.get("/students/:id/mentorship-requests", async (req, res) => {
    try {
        const { id } = req.params;
        const mentorshipRequests = await pool.query(
            "SELECT * FROM mentorship_requests WHERE student_id = $1",
            [id]
        );

        res.json(mentorshipRequests.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 8 - get student's posts
app.get("/students/:id/posts", async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await pool.query(
            "SELECT * FROM posts WHERE poster_id = $1 AND poster_type = 'student'",
            [id]
        );

        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 9 - get student's questions
app.get("/students/:id/questions", async (req, res) => {
    try {
        const { id } = req.params;
        const questions = await pool.query(
            "SELECT * FROM questions WHERE asker_id = $1",
            [id]
        );

        res.json(questions.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// 10 - get student's work experience
app.get("/students/:id/work-experiences", async (req, res) => {
    try {
        const { id } = req.params;
        const workExperiences = await pool.query(
            "SELECT * FROM work_experiences WHERE experience_holder_id = $1 AND experience_type = 'student'",
            [id]
        );

        res.json(workExperiences.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!READ THIS BEFORE IMPLEMENTING ROUTES!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/* 
use this structure for routes, making sure to use
the correct http request (POST, GET, PUT, DELETE)

the main thing is writing the correct SQL query in pool.query()

refer to the database!

the code looks long but it's actually not that bad! i swear!!!

express requests:
    - req.body is used for POST/PUT
    - req.param is used to access route parameters 
    - https://dev.to/gathoni/express-req-params-req-query-and-req-body-4lpc

app.get("/PATH/", async (req, res) => {
    try {
        
        // retrieve parameters using req.param or send data using req.body or both

        const object = await pool.query(
            "INSERT QUERY HERE $1", [variable for placeholder $1]
        );

        res.json(); // send json responses back to client --> send results of query back to front end
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
*/



// mentor routes

// work experience routes

// connection routes

// mentorship request routes

// question & answer routes

// search & filter routes



app.listen(5001, () => {
    console.log("server has started on port 5001");
});
