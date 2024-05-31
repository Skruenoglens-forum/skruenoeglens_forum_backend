const postModel = require("../models/postModel");
const auth = require("../utils/auth");
const path = require("path");
const fs = require("fs");

class PostController {
  async getall(req, res) {
    try {
      const posts = await postModel.getAllPosts();

      posts.forEach((post) => {
        if (post.image_ids) {
          post.image_ids = post.image_ids
            .split(",")
            .map((id) => parseInt(id, 10));
        } else {
          post.image_ids = [];
        }
      });

      res.json(posts);
    } catch (e) {
      res.status(500).json({ error: "internal server Error" });
    }
  }

  async getById(req, res) {
    const postId = req.params.id;
    try {
      const post = await postModel.getPostById(postId);

      if (post.image_ids) {
        post.image_ids = post.image_ids
          .split(",")
          .map((id) => parseInt(id, 10));
      } else {
        post.image_ids = [];
      }

      if (!post) {
        res.status(404).json({ error: "Kunne ikke finde opslag" });
      }
      res.json(post);
    } catch (e) {
      res.status(500).json({ error: "internal server error" });
    }
  }

  async getAllByUserId(req, res) {
    const userId = req.params.id;

    try {
      const posts = await postModel.getAllPostsByUserId(userId);

      posts.forEach((post) => {
        if (post.image_ids) {
          post.image_ids = post.image_ids
            .split(",")
            .map((id) => parseInt(id, 10));
        } else {
          post.image_ids = [];
        }
      });

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllByCategoryId(req, res) {
    const categoryId = req.params.id;

    try {
      const posts = await postModel.getAllPostsByCategoryId(categoryId);

      posts.forEach((post) => {
        if (post.image_ids) {
          post.image_ids = post.image_ids
            .split(",")
            .map((id) => parseInt(id, 10));
        } else {
          post.image_ids = [];
        }
      });

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllByCategoryIdAndLicensePlate(req, res) {
    const categoryId = req.params.id;
    const carBrand = req.params.brand;
    const carModel = req.params.model;

    try {
      const posts = await postModel.getAllPostsByCategoryIdAndLicensePlate(categoryId, carBrand, carModel);

      posts.forEach((post) => {
        if (post.image_ids) {
          post.image_ids = post.image_ids
            .split(",")
            .map((id) => parseInt(id, 10));
        } else {
          post.image_ids = [];
        }
      });

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllByLicensePlate(req, res) {
    const carBrand = req.params.brand;
    const carModel = req.params.Model;

    try {
      const posts = await postModel.getAllPostsByLicensPlate(carBrand, carModel);

      posts.forEach((post) => {
        if (post.image_ids) {
          post.image_ids = post.image_ids
            .split(",")
            .map((id) => parseInt(id, 10));
        } else {
          post.image_ids = [];
        }
      });

      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllImagesById(req, res) {
    const postId = req.params.id;

    try {
      const images = await postModel.getAllImagesByPostId(postId);

      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getImageByImageId(req, res) {
    const postImageId = req.params.id;

    try {
      const image = await postModel.getImage(postImageId);

      if (!image) {
        return res
          .status(200)
          .sendFile(path.join(__dirname, `../../uploads/default/post.png`));
      }

      const imagePath = path.join(__dirname, `../../uploads/${image.image}`);
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(200)
            .sendFile(path.join(__dirname, `../../uploads/default/post.png`));
        }

        res.status(200).sendFile(imagePath);
      });

      res.status(200).sendFile(imagePath);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req, res) {
    const token = req.header("Authorization");
    const {
      title,
      description,
      carBrand,
      carMotor,
      carFirstRegistration,
      carModel,
      carType,
      categoryId,
    } = req.body;

    try {
      const decoded = auth.verifyToken(token);

      // req.files is an array of files
      const files = req.files;

      const newpost = await postModel.createPost(
        decoded.uid,
        title,
        description,
        carBrand,
        carMotor,
        carFirstRegistration,
        carModel,
        carType,
        categoryId
      );

      if (files && files.length > 0) {
        for (const file of files) {
          await postModel.saveImage(file.filename, newpost.id);
        }
      } else {
        await postModel.saveImage("/default/post.png", newpost.id);
      }

      res.status(201).json(newpost);
    } catch (e) {
      res.status(500).json({ error: "internal server error" });
    }
  }

  async update(req, res) {
    const postId = req.params.id;
    const {
      title,
      description,
      carBrand,
      carMotor,
      carFirstRegistration,
      carModel,
      carType,
      categoryId,
    } = req.body;

    const token = req.header("Authorization");
    try {
      const decoded = auth.verifyToken(token);

      const isUserOwnerOfPost = await postModel.isUserOwnerOfPost(
        decoded.uid,
        postId
      );
      if (!isUserOwnerOfPost && decoded.roleId !== auth.ADMIN_ROLE_ID) {
        return res.status(400).json({ error: "Dette er ikke dit opslag" });
      }

      // req.files is an array of files
      const files = req.files;

      const updatedPost = await postModel.updatePost(
        postId,
        title,
        description,
        carBrand,
        carMotor,
        carFirstRegistration,
        carModel,
        carType,
        categoryId
      );
      if (!updatedPost) {
        return res.status(404).json({ error: "Kunne ikke finde opslag" });
      }

      // Remvoe old images
      await postModel.removeImages(updatedPost.id);

      // Save images associated with the post
      for (const file of files) {
        await postModel.saveImage(file.filename, updatedPost.id);
      }

      res.json(updatedPost);
    } catch (e) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req, res) {
    const postId = req.params.id;

    const token = req.header("Authorization");
    try {
      const decoded = auth.verifyToken(token);

      const isUserOwnerOfPost = await postModel.isUserOwnerOfPost(
        decoded.uid,
        postId
      );
      if (!isUserOwnerOfPost && decoded.roleId !== auth.ADMIN_ROLE_ID) {
        return res.status(400).json({ error: "Dette er ikke dit opslag" });
      }

      const deletePost = await postModel.deletePost(postId);
      if (!deletePost) {
        return res.status(404).json({ error: "Kunne ikke finde opslag" });
      }
      res.json({ message: "Post deleted successfully" });
    } catch (e) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new PostController();
