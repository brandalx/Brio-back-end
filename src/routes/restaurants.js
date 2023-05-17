import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  res.json({
    msg: "restaurants of Brio :)",
  });
});

export default router;
