

const Courses = require("../model/courseModel")
// get /api/courses
const getCourses = async ( req,res)=>{
    const courses = await Courses.find()
res.status(200).json(courses)
}

const getCourseById = async (req,res)=>{
    let id_to_search=req.params.id
    const course = await Courses.findById(id_to_search)
    res.status(200).json(course)
}

const getSearchedCourses = async (req,res,next)=>{
    const queryString = req.query.query.toLowerCase()
    console.log(req.query.query.toLowerCase())
    try{
        const searchCoursesData = await Courses.find({
            $text:{$search: queryString},
        })
        if(searchCoursesData.length !==0){
            res.status(200).json({
                success: true,
                message:"Got courses for query string",
                data: searchCoursesData
            })
        }else{
            res.status(200).json({
                success: false,
                message:"No relevant Search details!!",
                data: [],
            })
        } 
    }catch(err){
        res.status(409).json({
            success: false,
            message:"No relevant Search details!!",
           
        })
    }
}


module.exports={
    getCourses, getCourseById,getSearchedCourses
}