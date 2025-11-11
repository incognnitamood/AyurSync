const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory demo store (non-persistent)
const db = {
  patients: [],
  appointments: [],
  charts: [],
  recipes: [],
  foods: [
    { name:'Brown Rice', calories:111, protein:2.6, carbs:23, fats:0.9, vitamins:20, minerals:25, rasa:'Madhura', virya:'Sheeta', vipaka:'Madhura', dosha:{vata:-0.1,pitta:-0.1,kapha:+0.1} },
    { name:'Moong Dal', calories:105, protein:7.0, carbs:19.0, fats:0.6, vitamins:28, minerals:32, rasa:'Kashaya', virya:'Sheeta', vipaka:'Madhura', dosha:{vata:-0.2,pitta:-0.1,kapha:-0.1} },
    { name:'Spinach', calories:23, protein:2.9, carbs:3.6, fats:0.4, vitamins:50, minerals:45, rasa:'Tikta', virya:'Sheeta', vipaka:'Katu', dosha:{vata:+0.1,pitta:-0.2,kapha:-0.2} },
    { name:'Apple', calories:52, protein:0.3, carbs:14, fats:0.2, vitamins:22, minerals:18, rasa:'Madhura', virya:'Sheeta', vipaka:'Madhura', dosha:{vata:0,pitta:-0.1,kapha:+0.1} },
    { name:'Paneer', calories:265, protein:18, carbs:1.2, fats:20.8, vitamins:20, minerals:30, rasa:'Madhura', virya:'Sheeta', vipaka:'Madhura', dosha:{vata:-0.2,pitta:-0.1,kapha:+0.3} },
  ],
};

// Utilities
const uid = (p='id') => p + '_' + Math.random().toString(36).slice(2,9);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Foods
app.get('/api/foods', (req, res) => res.json(db.foods));
app.post('/api/foods/import', (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [];
  const added = items.filter(x => x && x.name);
  db.foods = db.foods.concat(added);
  res.json({ imported: added.length });
});

// Patients
app.get('/api/patients', (req, res) => res.json(db.patients));
app.post('/api/patients', (req, res) => {
  const p = req.body || {};
  p.id = uid('pat');
  p.createdAt = Date.now();
  db.patients.push(p);
  res.json(p);
});
app.put('/api/patients/:id', (req, res) => {
  const id = req.params.id;
  const idx = db.patients.findIndex(p => p.id === id);
  if (idx < 0) return res.status(404).json({ error: 'Not found' });
  db.patients[idx] = { ...db.patients[idx], ...req.body, id };
  res.json(db.patients[idx]);
});

// Appointments (used for progress records as well)
app.get('/api/appointments', (req, res) => res.json(db.appointments));
app.post('/api/appointments', (req, res) => {
  const a = req.body || {};
  a.id = uid('appt');
  db.appointments.push(a);
  res.json(a);
});

// Diet Charts
app.get('/api/charts', (req, res) => {
  const { patientId, date } = req.query;
  const chart = db.charts.find(c => c.patientId === patientId && c.date === date);
  res.json(chart || null);
});
app.post('/api/charts', (req, res) => {
  const c = req.body || {};
  if (!c.patientId || !c.date) return res.status(400).json({ error: 'patientId and date required' });
  const existing = db.charts.find(x => x.patientId === c.patientId && x.date === c.date);
  if (existing) {
    Object.assign(existing, c);
    return res.json(existing);
  }
  c.id = uid('chart');
  db.charts.push(c);
  res.json(c);
});

// Recipes
app.get('/api/recipes', (req, res) => res.json(db.recipes));
app.post('/api/recipes', (req, res) => {
  const r = req.body || {};
  r.id = uid('rec');
  db.recipes.push(r);
  res.json(r);
});

// Optional: serve the frontend (so you can run only the backend)
app.use('/', express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});