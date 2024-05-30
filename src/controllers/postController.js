const postModel = require('../models/postModel');
const auth = require('../utils/auth');
const path = require('path');
const fs = require('fs');

class PostController {
    async getall(req, res)
    {
        try {
            const posts = await postModel.getAllPosts();
                res.json(posts);
            }
            catch(e){
                res.staus(500).json({error: 'internal server Error'})
            }
    }
    
    async getById(req, res){
        const postId = req.params.id;
        try{
        const post = await postModel.getPostById(postId)
        if (!post){
            res.status(404).json({error:'post not found'});
        }
        res.json(post)
        }
        catch (e){
            res.status(500)({error: 'internal server error'})
        }
    }

    async getAllByUserId(req, res) {
        const userId = req.params.id;
    
        try {
          const posts = await postModel.getAllPostsByUserId(userId);
    
          res.json(posts);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      }

    async getAllByCategoryId(req, res) {
      const categoryId = req.params.id;
  
      try {
        const posts = await postModel.getAllPostsByCategoryId(categoryId);
  
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
          res.status(500).json({ error: 'Internal server error' });
        }
      }

    async getImageByImageId(req, res) {
        const postImageId = req.params.id;
    
        try {
            const image = await postModel.getImage(postImageId);
    
            const imagePath = path.join(__dirname, `../../uploads/${image.image}`)
            fs.access(imagePath, fs.constants.F_OK, (err) => {
              if (err) {
                  return res.status(200).sendFile(path.join(__dirname, `../../uploads/default/post.png`));
              }
    
              res.status(200).sendFile(imagePath);
            });
    
            res.status(200).sendFile(imagePath);
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
          
    async create(req, res){
        const token = req.header("Authorization");
        const {title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId} = req.body;

        try{
            const decoded = auth.verifyToken(token);

            // req.files is an array of files
            const files = req.files;

            const newpost = await postModel.createPost(decoded.uid, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId);

            // Save images associated with the post
            for (const file of files) {
                await postModel.saveImage(file.filename, newpost.id);
            }

            res.status(201).json(newpost);
        }
        catch(e){
            res.status(500).json({error: 'internal server error'})
        }
    }

    async update(req,res){
        const postId = req.params.id;
        const {title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId}= req.body;

        const token= req.header("Authorization");
        try{
            const decoded= auth.verifyToken(token);

            const isUserOwnerOfPost = await postModel.isUserOwnerOfPost(decoded.uid, postId);
            if (!isUserOwnerOfPost && decoded.roleId !== auth.ADMIN_ROLE_ID) {
              return res.status(400).json({ error: 'This is not your post'});
            }

            // req.files is an array of files
            const files = req.files;

            const updatedPost = await postModel.updatePost(postId, title, description, carBrand, carMotor, carFirstRegistration, carModel, carType, categoryId);
            if (!updatedPost){
                return res.status(404).json({error: 'post is not found'});
            }

            // Remvoe old images
            await postModel.removeImages(updatedPost.id)

            // Save images associated with the post
            for (const file of files) {
                await postModel.saveImage(file.filename, updatedPost.id);
            }

            res.json(updatedPost);
        }
        catch(e){
            res.status(500).json({error:'Internal server error'});
        }
    }

    async delete(req, res){
        const postId = req.params.id;
  
        const token = req.header("Authorization");
        try {
            const decoded= auth.verifyToken(token);

            const isUserOwnerOfPost = await postModel.isUserOwnerOfPost(decoded.uid, postId);
            if (!isUserOwnerOfPost && decoded.roleId !== auth.ADMIN_ROLE_ID) {
              return res.status(400).json({ error: 'This is not your post'});
            }

            const deletePost = await postModel.deletePost(postId);
            if (!deletePost){
                return res.status(404).json({error: 'post not found'});
            }
            res.json({message: 'Post deleted successfully'});
        }
        catch(e)
        {
            res.status(500).json({error:'Internal server error'});
        }
    }
}

module.exports = new PostController();