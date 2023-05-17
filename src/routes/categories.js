import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  res.json({
    msg: "categories of Brio :)",
  });
});

export default router;
