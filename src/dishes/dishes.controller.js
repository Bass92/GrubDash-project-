const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass

//checking if the dish is exist 
function exists(req, res, next){
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === dishId);
    if(!foundDish){
        return next ({
            status: 404,
            message:`Dish not found ${dishId}`,
        });
    };
    res.locals.dish = foundDish;
    next();
}

//checking if all properties are valid
function validateDish(req, res, next){
    const { data: { price } = {} } = req.body;       
    const requiredFields = ["name", "description", "price", "image_url"];

    for (const field of requiredFields) {
        if (!req.body.data[field]){
            next({ status: 400, message: `A '${field}' property is required.` });
        }
    }


//checking if price is a number and greater than 0 
    if (typeof price !== "number" || price < 1) {
        return res.status(400).json({ error: "price must be a number" });
      }
    if (price < 0) {
        return res
          .status(400)
          .json({ error: "price must be a number greater than zero" });
    }
    next();
}

//checking if new dish has all required properties 
function validateUpdate(req, res, next) {
    //getting id from params
    const { dishId } = req.params;
    //getting newDish
    const newDish = req.body.data;
    //if no id, set id to the one from params
    if(!newDish.id) newDish.id = dishId;
    //if newDish id and the one from params do not match, throw error
    if(newDish.id != dishId){
        return next({
            status: 400,
            message: `Dish id ${newDish.id} does not match the route link!`,
        });        
    }
    next();
}

//returns specific dish
function read(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find(dish => dish.id === dishId);
    res.json({ data: foundDish });
}

//updates existing dish
function update(req, res, next) {
    const newDish = req.body.data;
    for(let dish of dishes){
        if(dish.id == newDish.id){
            Object.assign(dish, newDish);
        };
    };
    res.json({ data: newDish });
}

//lists all existing dishes
function list(req, res, next) {
    res.json({ data: dishes });
}

//creates new dish
function create(req, res, next) {
    let newDish = req.body.data;
    newDish.id = nextId();
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

module.exports = {
    read: [exists, read],
    update: [exists, validateDish, validateUpdate, update],
    list,
    create: [validateDish, create],
}