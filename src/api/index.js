const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

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

const ACCESS_TOKEN = "EAAMpSHmkcGYBADNBwm9RCyPDf0DevFVB82JPnfWY6u2zqVqczv1M7dXQyn1EKC6ZCd89JfZCjMZA3mybvRNAvrHvLZCyNIrLjIzzx9vuWcsm8GvpoCiHYzZBFtl4ECsDYUrqP2EZAj7sHgkoQGRZAJiIfOPFjarMbhvUchtJDaEys1gf5W7CNAA7kn6cUJZBZCgf79Acs57mbDNhfG4ZB6gvT9TopbthiXynQZBLxx91nIAMfUuvsuqyIQZCsanPdjr6QSsZD";
const basicFacebook = "https://www.facebook.com/instagram";

router.get('/instagram/defaultEmbed', (req, res) =>{      
  axios.get(`https://graph.facebook.com/v15.0/oembed_page?url=${basicFacebook}&access_token=${ACCESS_TOKEN}`).then( response => {
    res.json(response.data.html);
  })
})

router.get('/')

module.exports = router;
