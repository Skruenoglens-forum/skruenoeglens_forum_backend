const categoryModel = require('../models/categoryModel');

class CategoryController {
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
}

module.exports = new CategoryController();