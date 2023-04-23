// TO-DO: add auth middleware
const router = express.Router();
// For each route there is a call to the controller that implements the required logic
router.get("/", usersController.getUsers);

export default router;
