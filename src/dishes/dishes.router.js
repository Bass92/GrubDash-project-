const router = require("express").Router();
const { list, create, read, update } = require("./dishes.controller");
//const controller = require("./dishes.controller");
// TODO: Implement the /dishes routes needed to make the tests pass

const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:dishId")
         .get(read)
         .put(update)
         .all(methodNotAllowed);

router.route("/").get(list).post(create).all(methodNotAllowed);
module.exports = router;
