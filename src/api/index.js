const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  "https://mdwlzfwjihhrecmsgotj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd2x6ZndqaWhocmVjbXNnb3RqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDI5NzI1MSwiZXhwIjoxOTc5ODczMjUxfQ.8K-mtTWV_Ls8t7WK1jRj-_XHmQGAgEKfAAB2yku-eXY"
);
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.get("/getAllClubs", async (req, res, next) => {
  const { data, error } = await supabase.from("organizations").select("*");
  if (error) return res.json(error);
  res.json(data);
});

router.get("/searchClubs", async (req, res, next) => {
  let { query } = req.query; // get request params
  const { data, error } = await supabase // query db
    .from("organizations")
    .select("*")
    .or(`name.ilike.*${query}*,shortName.ilike.*${query}*,summary.ilike.*${query}*`)
    .order("fitness", { ascending: false })
    .limit(100);
  if (error) return res.json(error);
  res.json({ count: data.length, results: data });
});

module.exports = router;
