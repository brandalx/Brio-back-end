import { Router } from "express";

const router = Router();
router.get("/", async (req, res) => {
  res.json({
    msg: "products of Brio :)",
  });
});

export default router;
