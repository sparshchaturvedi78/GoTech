const Category = require("../Models/category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

//create category
exports.createCategory = async (req, res) => {
    try {
        //get the data from the body
        const { name, description } = req.body;

        //validate name is give
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        //validate, category already exist or not
        const existAlready = await Category.findOne({ name: name });
        if (existAlready) {
            return res.status(400).json({
                success: false,
                message: "Category already exist"
            })
        }

        //create the category
        const createdCategory = await Category.create({
            name,
            description
        });

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            createdCategory
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Category not created successfully, server error"
        })
    }
}

//showing all the categories
exports.showAllCategories = async (req, res) => {
    try {
        console.log("INSIDE SHOW ALL CATEGORIES");
        const allCategorys = await Category.find({});
        res.status(200).json({
            success: true,
            data: allCategorys,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//categoryPageDetails - pending
exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "courses",
                match: { status: "Published" }, // Fetch only "Published" courses
                populate: {
                    path: "ratingAndReviews", // Populate "ratingAndReviews" for each course
                },
            });

        //console.log("SELECTED COURSE", selectedCategory)  
        // Handle the case when the category is not found
        if (!selectedCategory) {
            console.log("Category not found.")
            return res
                .status(404)
                .json({ success: false, message: "Category not found" })
        }
        // Handle the case when there are no courses
        if (selectedCategory.courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No courses found for the selected category.",
            })
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
                ._id
        )
            .populate({
                path: "courses",
                match: { status: "Published" },
            })
        //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
            })
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}