// En /models/articulo.js
const pool = require('./db');

// --- Helper para manejar las palabras clave ---
async function manageKeywords(client, idArticulo, keywords = []) {
  if (keywords.length === 0) return;

  await client.query(
    'DELETE FROM articulo_palabraclave WHERE idarticulo = $1',
    [idArticulo]
  );

  for (const termino of keywords) {
    if (!termino) continue;

    const resPalabra = await client.query(
      `INSERT INTO palabraclave (termino)
       VALUES ($1)
       ON CONFLICT (termino) DO UPDATE SET termino = EXCLUDED.termino
       RETURNING idpalabraclave`,
      [termino.trim().toLowerCase()]
    );

    const idPalabraClave = resPalabra.rows[0].idpalabraclave;

    await client.query(
      `INSERT INTO articulo_palabraclave (idarticulo, idpalabraclave)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [idArticulo, idPalabraClave]
    );
  }
}

const Articulo = {
  // --- CREATE ---
  async create({ autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha, keywords = [] }) {
    const fechaFinal = fecha ? fecha.substring(0, 10) : null;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `INSERT INTO articulo
         (autor, idusuario, idnumero, titulo, resumen, documento, nopaginas, fecha)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING *`,
        [autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fechaFinal]
      );

      const articulo = result.rows[0];

      await manageKeywords(client, articulo.idarticulo, keywords);

      await client.query('COMMIT');

      articulo.palabras_clave = keywords.join(', ');
      return articulo;

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // --- UPDATE ---
  async update({ idArticulo, autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha, keywords = [] }) {
    const fechaFinal = fecha ? fecha.substring(0, 10) : null;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const result = await client.query(
        `UPDATE articulo SET
          autor=$1, idusuario=$2, idnumero=$3, titulo=$4,
          resumen=$5, documento=COALESCE($6, documento),
          nopaginas=$7, fecha=$8
         WHERE idarticulo=$9
         RETURNING *`,
        [autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fechaFinal, idArticulo]
      );

      if (!result.rows.length) throw new Error('Artículo no encontrado');

      await manageKeywords(client, idArticulo, keywords);

      await client.query('COMMIT');

      const articulo = result.rows[0];
      articulo.palabras_clave = keywords.join(', ');
      return articulo;

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  // --- FIND ALL ---
  async findAll() {
    const query = `
      SELECT
        a.idarticulo AS id,
        a.autor,
        a.idusuario,
        a.idnumero,
        a.titulo,
        a.resumen,
        a.nopaginas,
        a.fecha,
        STRING_AGG(pc.termino, ', ') AS palabras_clave
      FROM articulo a
      LEFT JOIN articulo_palabraclave apc ON a.idarticulo = apc.idarticulo
      LEFT JOIN palabraclave pc ON apc.idpalabraclave = pc.idpalabraclave
      GROUP BY
        a.idarticulo, a.autor, a.idusuario, a.idnumero,
        a.titulo, a.resumen, a.nopaginas, a.fecha
      ORDER BY a.fecha DESC, a.idarticulo DESC
    `;

    const result = await pool.query(query);
    return result.rows;
  },

  // --- FIND BY ID ---
  async findById(idArticulo) {
    const query = `
      SELECT
        a.idarticulo AS id,
        a.autor,
        a.idusuario,
        a.idnumero,
        a.titulo,
        a.resumen,
        a.nopaginas,
        a.fecha,
        a.documento,
        STRING_AGG(pc.termino, ', ') AS palabras_clave
      FROM articulo a
      LEFT JOIN articulo_palabraclave apc ON a.idarticulo = apc.idarticulo
      LEFT JOIN palabraclave pc ON apc.idpalabraclave = pc.idpalabraclave
      WHERE a.idarticulo = $1
      GROUP BY
        a.idarticulo, a.autor, a.idusuario, a.idnumero,
        a.titulo, a.resumen, a.nopaginas, a.fecha, a.documento
    `;

    const result = await pool.query(query, [idArticulo]);
    return result.rows[0];
  },

  // --- FIND BY KEYWORD ---
  async findByKeyword(termino) {
    const query = `
      SELECT DISTINCT
        a.idarticulo AS id,
        a.autor,
        a.idusuario,
        a.idnumero,
        a.titulo,
        a.resumen,
        a.nopaginas,
        a.fecha,
        a.documento,
        (
          SELECT STRING_AGG(pc2.termino, ', ')
          FROM articulo_palabraclave apc2
          JOIN palabraclave pc2 ON apc2.idpalabraclave = pc2.idpalabraclave
          WHERE apc2.idarticulo = a.idarticulo
        ) AS palabras_clave
      FROM articulo a
      JOIN articulo_palabraclave apc ON a.idarticulo = apc.idarticulo
      JOIN palabraclave pc ON apc.idpalabraclave = pc.idpalabraclave
      WHERE pc.termino ILIKE $1
      ORDER BY a.fecha DESC
    `;

    const result = await pool.query(query, [termino.trim()]);
    return result.rows;
  },

  // --- DELETE ---
  async delete(idArticulo) {
    const result = await pool.query(
      'DELETE FROM articulo WHERE idarticulo = $1 RETURNING idarticulo',
      [idArticulo]
    );
    return result.rows.length > 0;
  }
};

module.exports = Articulo;
