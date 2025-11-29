const pool = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // 1. Imprimir qué nos llega (Para depurar)
    console.log("Intento de registro con:", req.body);
    
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ msg: 'Faltan datos (email o password).' });
    }

    // 2. Verificar usuario (Usando la sintaxis segura de mysql2)
    // pool.query devuelve un arreglo: [filas, campos]
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    // Imprimir qué devolvió la BD (Para depurar)
    console.log("Resultado búsqueda usuario:", rows);

    // Ahora sí, validamos de forma segura
    if (rows && rows.length > 0) {
      return res.status(400).json({ msg: 'El usuario ya existe.' });
    }

    // 3. Encriptar password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 4. Crear usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (email, password_hash) VALUES (?, ?)', 
      [email, password_hash]
    );

    console.log("Usuario creado con ID:", result.insertId);

    // 5. Token
    const payload = { userId: result.insertId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });

  } catch (error) { // Usamos 'error' para evitar confusiones
    console.error("Error en register:", error);
    res.status(500).send('Error en el servidor');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Buscar al usuario
    const [user] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ msg: 'Credenciales inválidas (email).' });
    }

    //Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas (pass).' });
    }

    //Crear y enviar token
    const payload = { userId: user[0].id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
};