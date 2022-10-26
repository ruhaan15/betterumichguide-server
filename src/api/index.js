const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mdwlzfwjihhrecmsgotj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kd2x6ZndqaWhocmVjbXNnb3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ0NjE0ODIsImV4cCI6MTk4MDAzNzQ4Mn0.5LaklqDwL_S4jNnY5ZptTf7V68wCNFJY519sOQEwPG4',
);
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get("/clubs/getAllClubs", async (req, res, next) => {
  const { limit } = req.query; // get request params
  console.log();
  const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("fitness", {ascending: false})
      .limit(limit || 2000);

  if (error) return res.json(error);
  res.json(data);
});

router.get('/clubs/searchClubs', async (req, res, next) => {
  const { query } = req.query; // get request params
  console.log(req.params, req.query);
  const { data, error } = await supabase // query db
    .from('organizations')
    .select('*')
    .or(`name.ilike.*${query}*,shortName.ilike.*${query}*,summary.ilike.*${query}*`)
    .limit(100);
  if (error) return res.json(error);
  res.json({ count: data.length, results: data });
});

router.get('/clubs/:club_id', async (req, res) => {
  const { club_id } = req.params;
  // TODO(ruhaan): should I be querying based on name or id
  const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', `${club_id}`)
      .limit(1);
  if (error) return res.json(error);
  // console.log(data);
  res.json(data);
})

module.exports = router;
