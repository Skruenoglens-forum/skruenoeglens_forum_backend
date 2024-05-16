const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const auth = require('../utils/auth');
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
        const post = await postModel.getPostByUserId(postId)
        if (!post){
            res.status(404).json({error:'post not found'});
        }
        res.json(post)
        }
        catch (e){
            res.status(500)({error: 'internal server error'})
        }
    }
    
    async create(req, res){
        const {title, user_id, description, brand, motor, modelYear, model, type, parentId}= req.body;
        try{
            const user = await userModel.getUserById(user_id)
            if (!user){
                return res.status(400).json({error:'Bad request. User does not exist'});
            }

            const newpost = await postModel.createPost(title, user_id, description, brand, motor, modelYear, model, type, parentId);
            res.status(201).json(newpost);
        }
        catch(e){
            res.status(500).json({error: 'internal server error'})
        }
    }

    async update(req,res){
        const postId = req.params.id;
        const {title, description, userId}= req.body;
        const token= req.header("Authorization");
        try{
            const decoded= auth.verifyToken(token);

            const isUserOwnerOfPost = await postModel.isUserOwnerOfPost(decoded.uid, postId);
            if (!isUserOwnerOfPost && decoded.role_id !== auth.ADMIN_ROLE_ID) {
              return res.status(400).json({ error: 'This is not your post'});
            }

            const updatedPost = postModel.updatePost(postId,title,description);
            if (!updatedPost){
                return res.status(404).json({error: 'post is not found'});
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
            if (!isUserOwnerOfPost && decoded.role_id !== auth.ADMIN_ROLE_ID) {
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