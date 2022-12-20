const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);
const router = express.Router();

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
};

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/clubs/getAllClubs', async (req, res, next) => {
  const { page } = req.query; // get request params
  if (page) {
    const { from, to } = getPagination(page, 10);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .range(from, to);

    if (error) return res.json(error);
    res.json(data);
  } else {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .limit(2000);

    if (error) return res.json(error);
    res.json(data);
  }
});

router.get('/clubs/searchClubs', async (req, res, next) => {
  const { query } = req.query; // get request params
  console.log(req.params, req.query);
  const { data, error } = await supabase // query db
    .from('organizations')
    .select('*')
    .or(
      `name.ilike.*${query}*,shortName.ilike.*${query}*,summary.ilike.*${query}*`,
    )
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
});

const ACCESS_TOKEN =
  'EAAMpSHmkcGYBADNBwm9RCyPDf0DevFVB82JPnfWY6u2zqVqczv1M7dXQyn1EKC6ZCd89JfZCjMZA3mybvRNAvrHvLZCyNIrLjIzzx9vuWcsm8GvpoCiHYzZBFtl4ECsDYUrqP2EZAj7sHgkoQGRZAJiIfOPFjarMbhvUchtJDaEys1gf5W7CNAA7kn6cUJZBZCgf79Acs57mbDNhfG4ZB6gvT9TopbthiXynQZBLxx91nIAMfUuvsuqyIQZCsanPdjr6QSsZD';
const basicFacebook = 'https://www.facebook.com/instagram';

router.get('/instagram/defaultEmbed', (req, res) => {
  axios
    .get(
      `https://graph.facebook.com/v15.0/oembed_page?url=${basicFacebook}&access_token=${ACCESS_TOKEN}`,
    )
    .then((response) => {
      res.json(response.data.html);
    });
});

router.get('/');

module.exports = router;
