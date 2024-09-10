const express = require('express');
const mysql = require('mysql2');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

// Configuración de conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'vivero'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vivero API',
            version: '1.0.0',
            description: 'API para gestionar el catálogo y pedidos de un vivero de plantas y flores',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /catalogo:
 *   get:
 *     tags:
 *       - Catálogo
 *     summary: Obtiene el catálogo de plantas y flores
 *     description: Retorna una lista del catálogo de plantas y flores. Puedes filtrar por categoría.
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (ej Plantas de jardín, Plantas silvestres, Plantas para cosecha)
 *     responses:
 *       200:
 *         description: Lista de productos del catálogo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Rosa"
 *                   categoria:
 *                     type: string
 *                     example: "Plantas de jardín"
 *                   precio:
 *                     type: number
 *                     example: 50.5
 *                   stock:
 *                     type: integer
 *                     example: 100
 */
app.get('/catalogo', (req, res) => {
    const categoria = req.query.categoria;
    let sql = 'SELECT * FROM catalogo';
    if (categoria) {
        sql += ` WHERE categoria = '${categoria}'`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error obteniendo el catálogo');
        } else {
            res.json(result);
        }
    });
});
/**
 * @swagger
 * /pedidos:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Obtiene todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   cliente:
 *                     type: string
 *                   planta:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 *                   total:
 *                     type: number
 */
app.get('/pedidos', (req, res) => {
    const sql = 'SELECT * FROM pedidos';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error obteniendo los pedidos');
        } else {
            res.json(result);
        }
    });
});

/**
 * @swagger
 * /pedidos:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Crear un nuevo pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *               planta:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */
app.post('/pedidos', (req, res) => {
    const { cliente, planta, cantidad, total } = req.body;
    const sql = 'INSERT INTO pedidos (cliente, planta, cantidad, total) VALUES (?, ?, ?, ?)';
    db.query(sql, [cliente, planta, cantidad, total], (err, result) => {
        if (err) {
            res.status(500).send('Error creando el pedido');
        } else {
            res.status(201).send({ message: 'Pedido creado exitosamente' });
        }
    });
});

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     tags:
 *       - Pedidos
 *     summary: Actualiza un pedido existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *               planta:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *               total:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente
 */
app.put('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const { cliente, planta, cantidad, total } = req.body;
    const sql = 'UPDATE pedidos SET cliente = ?, planta = ?, cantidad = ?, total = ? WHERE id = ?';
    db.query(sql, [cliente, planta, cantidad, total, id], (err, result) => {
        if (err) {
            res.status(500).send('Error actualizando el pedido');
        } else {
            res.send({ message: 'Pedido actualizado correctamente' });
        }
    });
});

/**
 * @swagger
 * /pedidos/{id}:
 *   delete:
 *     tags:
 *       - Pedidos
 *     summary: Elimina un pedido existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido a eliminar
 *     responses:
 *       200:
 *         description: Pedido eliminado correctamente
 */
app.delete('/pedidos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM pedidos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error eliminando el pedido');
        } else {
            res.send({ message: 'Pedido eliminado correctamente' });
        }
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
