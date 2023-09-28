const express = require("express");
const cors = require("cors");
const { connection } = require("./db");
const { userRoute } = require("./routes/userRoute");
const { blogRoute } = require("./routes/blogRoute");
const app = express();
app.use(cors());
app.use(express.json());



app.use("/api",userRoute);
app.use("/api",blogRoute)



app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log(`server is running at port ${process.env.PORT}`);
    } catch (err) {
        console.log(err);
    }
})