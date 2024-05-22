const categoryModel = require('../models/categoryModel');

class CategoryController {
    async getall(req, res)
    {
        try {
            const categories = await categoryModel.getAllCategories();
                res.json(categories);
            }
            catch(e){
                res.staus(500).json({error: 'internal server Error'})
            }
    }
}

module.exports = new CategoryController();