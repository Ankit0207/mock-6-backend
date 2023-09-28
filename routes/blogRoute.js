const express = require("express");
const { blogModel } = require("../model/blogModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const blogRoute = express.Router();


blogRoute.get("/blogs", authMiddleware, async (req, res) => {
    const { title, category, date, orderBy } = req.query;
    const query = {};
    if (title) {
        query.title = { $in: title };
    }
    if (category) {
        query.category = { $in: category };
    }
    if (date) {
        query.date = { $in: date };
    }
    let sortObj = {};
    if (orderBy == "asc") {
        sortObj.date = 1;
    } else if (orderBy == "desc") {
        sortObj.date = -1;
    }
    try {
        const blogs = await blogModel.find(query).sort(sortObj);
        return res.status(200).json({ blogs });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
})


blogRoute.post("/blogs", authMiddleware, async (req, res) => {
    try {
        const blog = await new blogModel({ ...req.body, userId: req.userId, userName: req.userName });
        await blog.save();
        return res.status(200).json({ msg: "blog uploaded" })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
})


blogRoute.patch("/blogs/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const blog = await blogModel.findOne({ _id: id });
    try {
        if (req.userId == blog.userId) {
            await blogModel.findByIdAndUpdate({ _id: id }, req.body);
            return res.status(200).json({ msg: "blog updated" })
        } else {
            return res.status(400).json({ msg: "user not authorized" })
        }
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
})

blogRoute.delete("/blogs/:id",authMiddleware,async(req,res)=>{
    const { id } = req.params;
    const blog = await blogModel.findOne({ _id: id });
    try {
        if (req.userId == blog.userId) {
            await blogModel.findByIdAndDelete({ _id: id });
            return res.status(200).json({ msg: "blog deleted" })
        } else {
            return res.status(400).json({ msg: "user not authorized" })
        }
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
})


module.exports={blogRoute};