const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));

let compromissos = [
  { id: 1, titulo: 'Reunião de Equipes', data: '2025-10-15', hora: '10:00' },
  { id: 2, titulo: 'Consulta médica', data: '2025-10-16', hora: '14:30' }
];

const header = `
  <style>
    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }
    header { background-color: #004080; color: white; padding: 20px; text-align: center; }
    nav a { margin: 0 15px; color: white; text-decoration: none; }
    main { padding: 40px; }
    h1, h2 { color: #004080; }
    input, button { padding: 10px; margin-top: 10px; width: 300px; display: block; }
  </style>
  <header>
    <nav>
      <a href="/marcar">Marcar Compromisso</a>
      <a href="/modificar">Modificar Compromisso</a>
    </nav>
  </header>
`;


app.get('/', (req, res) => {
  const lista = compromissos.map(c => `<li><strong>${c.titulo}</strong> - ${c.data} às ${c.hora}</li>`).join('');
  res.send(`
    <html>
      <head><title>Agenda</title>${header}</head>
      <body>
        <main>
          <h2>Seus Compromissos</h2>
          <ul>${lista}</ul>
        </main>
      </body>
    </html>
  `);
});

app.get('/marcar', (req, res) => {
  res.send(`
    <html>
      <head><title>Marcar Compromisso</title>${header}</head>
      <body>
        <main>
          <h2>Marcar Novo Compromisso</h2>
          <form method="POST" action="/marcar">
            <input type="text" name="titulo" placeholder="Título do compromisso" required>
            <input type="date" name="data" required>
            <input type="time" name="hora" required>
            <button type="submit">Salvar</button>
          </form>
        </main>
      </body>
    </html>
  `);
});

app.post('/marcar', (req, res) => {
  const { titulo, data, hora } = req.body;
  const novoId = compromissos.length + 1;
  compromissos.push({ id: novoId, titulo, data, hora });
  res.redirect('/');
});

app.get('/modificar', (req, res) => {
  const options = compromissos.map(c => `<option value="${c.id}">${c.titulo} (${c.data} às ${c.hora})</option>`).join('');
  res.send(`
    <html>
      <head><title>Modificar Compromisso</title>${header}</head>
      <body>
        <main>
          <h2>Modificar Compromisso</h2>
          <form method="POST" action="/modificar">
            <label for="id">Selecione o compromisso:</label>
            <select name="id" required>${options}</select>
            <input type="text" name="titulo" placeholder="Novo título" required>
            <input type="date" name="data" required>
            <input type="time" name="hora" required>
            <button type="submit">Atualizar</button>
          </form>
        </main>
      </body>
    </html>
  `);
});

app.post('/modificar', (req, res) => {
  const { id, titulo, data, hora } = req.body;
  const compromisso = compromissos.find(c => c.id == id);
  if (compromisso) {
    compromisso.titulo = titulo;
    compromisso.data = data;
    compromisso.hora = hora;
  }
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
