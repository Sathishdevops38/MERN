const router = require('express').Router();
const supabase = require('../supabaseClient');

router.route('/').get(async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.route('/add').post(async (req, res) => {
  const { description, priority } = req.body;
  // Ensure due_date is null if it's an empty string
  const due_date = req.body.due_date || null;

  const { data, error } = await supabase
    .from('todos')
    .insert([{ description, due_date, priority, completed: false }])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data[0]);
});

router.route('/:id').get(async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').select('*').eq('id', id).single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

router.route('/:id').delete(async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('todos').delete().eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Todo deleted' });
});

router.route('/update/:id').post(async (req, res) => {
    const { id } = req.params;
    const { description, completed, dueDate, priority } = req.body;

    const { data, error } = await supabase
        .from('todos')
        .update({ description, completed, due_date: dueDate, priority })
        .eq('id', id)
        .select();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data[0]);
});

module.exports = router;
