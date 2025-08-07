const router = require('express').Router();
const supabase = require('../supabaseClient');

router.route('/').get(async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.route('/:id').get(async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

router.route('/:id').delete(async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').delete().eq('id', id).select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

module.exports = router;