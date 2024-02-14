const PostModel = require("../models/post.model");

const addPosts = async (req, res) => {
  const company = req.params.company;
  const postsData = req.body;

  try {
    const createdPosts = await Promise.all(
      postsData.map(async (post) => {
        const createdPost = await PostModel.create({
          userId: post.userId,
          title: post.title,
          body: post.body,
          company: company,
        });
        return createdPost;
      })
    );

    res.status(201).json({
      msg: "Download in Excel",
      message: "Posts created successfully",
      createdPosts,
    });
  } catch (error) {
    console.error("Error creating posts:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getPosts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await PostModel.find({userId:userId});
    let result = "";
    if (posts.length > 0) {
      result = "Download in Excel";
    } else {
      result = "Bulk Add";
    }
    res.status(200).json({ msg: result, posts });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

module.exports = { addPosts, getPosts };
