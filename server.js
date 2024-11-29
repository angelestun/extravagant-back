const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); 

app.listen(3000, () => {
    console.log("Server prendido en el puerto 3000");
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'M2003d12', 
    database: 'TiendaCalzado' 
});

connection.connect((err) => {
    if (err) {
        console.error("Error de conexión: ", err);
    } else {
        console.log("Conexión a la base de datos realizada!");
    }
});

// CRUD para la tabla Usuario

// POST - Registrar un nuevo usuario
app.post('/registro', (req, res) => {
    const { Nombre, Apellido, Correo, Contraseña } = req.body;
    const query = 'INSERT INTO Usuario (Nombre, Apellido, Correo, Contraseña) VALUES (?, ?, ?, ?)';

    connection.query(query, [Nombre, Apellido, Correo, Contraseña], (err, results) => {
        if (err) {
            console.error("Error al registrar usuario: ", err);
            res.status(500).json({ error: "Error al registrar usuario" });
            return;
        }
        res.status(201).json({ message: "Usuario registrado con éxito" });
    });
});

// POST - Iniciar sesión
app.post('/login', (req, res) => {
    const { Correo, Contraseña } = req.body;
    const query = 'SELECT * FROM Usuario WHERE Correo = ? AND Contraseña = ?';

    connection.query(query, [Correo, Contraseña], (err, results) => {
        if (err) {
            console.error("Error al iniciar sesión: ", err);
            res.status(500).json({ error: "Error al iniciar sesión" });
            return;
        } else if (results.length === 0) {
            res.status(401).json({ error: "Correo o contraseña incorrectos" });
            return;
        }
        res.status(200).json({ message: "Inicio de sesión exitoso", usuario: results[0] });
    });
});

// GET - Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const query = 'SELECT * FROM Usuario';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener usuarios: ", err);
            res.status(500).json({ error: "Error al obtener usuarios" });
            return;
        }
        res.status(200).json(results);
    });
});

// GET - Obtener un usuario por ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Usuario WHERE ID_Usuario = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener usuario: ", err);
            res.status(500).json({ error: "Error al obtener usuario" });
            return;
        } else if (results.length === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        res.status(200).json(results[0]);
    });
});

// PUT - Actualizar un usuario existente
app.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Correo, Contraseña } = req.body;
    const query = 'UPDATE Usuario SET Nombre = ?, Apellido = ?, Correo = ?, Contraseña = ? WHERE ID_Usuario = ?';

    connection.query(query, [Nombre, Apellido, Correo, Contraseña, id], (err, results) => {
        if (err) {
            console.error("Error al actualizar usuario: ", err);
            res.status(500).json({ error: "Error al actualizar usuario" });
            return;
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        res.status(200).json({ message: "Usuario actualizado con éxito" });
    });
});

// DELETE - Eliminar un usuario existente
app.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Usuario WHERE ID_Usuario = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar usuario: ", err);
            res.status(500).json({ error: "Error al eliminar usuario" });
            return;
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }
        res.status(200).json({ message: "Usuario eliminado con éxito" });
    });
});

//CRUD PRODUCTOS
// Crear Producto
app.post('/productos', (req, res) => {
    const { Nombre_Producto, Descripción, Precio, Stock, Talla, Color, Imagen } = req.body;
    const query = 'INSERT INTO Producto (Nombre_Producto, Descripción, Precio, Stock, Talla, Color, Imagen) VALUES (?, ?, ?, ?, ?, ?, ?)';

    connection.query(query, [Nombre_Producto, Descripción, Precio, Stock, Talla, Color, Imagen], (err, results) => {
        if (err) {
            console.error("Error al crear producto: ", err);
            res.status(500).json({ error: "Error al crear producto" });
            return;
        }
        res.status(201).json({ message: "Producto creado con éxito" });
    });
});

// Obtener Productos
app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM Producto';

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener productos: ", err);
            res.status(500).json({ error: "Error al obtener productos" });
            return;
        }
        res.status(200).json(results);
    });
});

// Actualizar Producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { Nombre_Producto, Descripción, Precio, Stock, Talla, Color, Imagen } = req.body;
    const query = 'UPDATE Producto SET Nombre_Producto = ?, Descripción = ?, Precio = ?, Stock = ?, Talla = ?, Color = ?, Imagen = ? WHERE ID_Producto = ?';

    connection.query(query, [Nombre_Producto, Descripción, Precio, Stock, Talla, Color, Imagen, id], (err, results) => {
        if (err) {
            console.error("Error al actualizar producto: ", err);
            res.status(500).json({ error: "Error al actualizar producto" });
            return;
        }
        res.status(200).json({ message: "Producto actualizado con éxito" });
    });
});

// Eliminar Producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Producto WHERE ID_Producto = ?';

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar producto: ", err);
            res.status(500).json({ error: "Error al eliminar producto" });
            return;
        }
        res.status(200).json({ message: "Producto eliminado con éxito" });
    });
}); 

// CRUD para la tabla Pedido

// GET - Obtener todos los pedidos
app.get('/pedidos', (req, res) => {
    connection.query("SELECT * FROM Pedido", (err, rows) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error en la consulta');
        } else {
            res.json(rows);
        }
    });
});

// GET - Obtener un pedido por ID
app.get('/pedidos/:id', (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM Pedido WHERE ID_Pedido = ?", [id], (err, row) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error en la consulta');
        } else if (row.length === 0) {
            res.status(404).send('Pedido no encontrado');
        } else {
            res.json(row[0]);
        }
    });
});

// POST - Agregar un nuevo pedido
app.post('/pedidos', (req, res) => {
    const { ID_Usuario, Fecha_Pedido, Estado_Pedido, Total } = req.body;
    const sql = "INSERT INTO Pedido (ID_Usuario, Fecha_Pedido, Estado_Pedido, Total) VALUES (?, ?, ?, ?)";
    
    connection.query(sql, [ID_Usuario, Fecha_Pedido, Estado_Pedido, Total], (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error al agregar pedido');
        } else {
            res.status(201).send('Pedido agregado correctamente');
        }
    });
});

// PUT - Actualizar un pedido existente
app.put('/pedidos/:id', (req, res) => {
    const id = req.params.id;
    const { ID_Usuario, Fecha_Pedido, Estado_Pedido, Total } = req.body;
    const sql = "UPDATE Pedido SET ID_Usuario = ?, Fecha_Pedido = ?, Estado_Pedido = ?, Total = ? WHERE ID_Pedido = ?";
    
    connection.query(sql, [ID_Usuario, Fecha_Pedido, Estado_Pedido, Total, id], (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error al actualizar pedido');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Pedido no encontrado');
        } else {
            res.send('Pedido actualizado correctamente');
        }
    });
});

// DELETE - Eliminar un pedido existente
app.delete('/pedidos/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Pedido WHERE ID_Pedido = ?";
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error al eliminar pedido');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Pedido no encontrado');
        } else {
            res.send('Pedido eliminado correctamente');
        }
    });
});


// CRUD para la tabla Detalle_Pedido

// GET - Obtener todos los detalles de pedidos
app.get('/detalle_pedidos', (req, res) => {
    connection.query("SELECT * FROM Detalle_Pedido", (err, rows) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error en la consulta');
        } else {
            res.json(rows);
        }
    });
});

// GET - Obtener un detalle de pedido por ID
app.get('/detalle_pedidos/:id', (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM Detalle_Pedido WHERE ID_Detalle_Pedido = ?", [id], (err, row) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error en la consulta');
        } else if (row.length === 0) {
            res.status(404).send('Detalle de pedido no encontrado');
        } else {
            res.json(row[0]);
        }
    });
});

// POST - Agregar un nuevo detalle de pedido
app.post('/detalle_pedidos', (req, res) => {
    const { ID_Pedido, ID_Producto, Cantidad, Precio_Unitario } = req.body;
    const sql = "INSERT INTO Detalle_Pedido (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario) VALUES (?, ?, ?, ?)";
    
    connection.query(sql, [ID_Pedido, ID_Producto, Cantidad, Precio_Unitario], (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error al agregar detalle de pedido');
        } else {
            res.status(201).send('Detalle de pedido agregado correctamente');
        }
    });
});

// PUT - Actualizar un detalle de pedido existente
app.put('/detalle_pedidos/:id', (req, res) => {
    const id = req.params.id;
    const { ID_Pedido, ID_Producto, Cantidad, Precio_Unitario } = req.body;
    const sql = "UPDATE Detalle_Pedido SET ID_Pedido = ?, ID_Producto = ?, Cantidad = ?, Precio_Unitario = ? WHERE ID_Detalle_Pedido = ?";
    
    connection.query(sql, [ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, id], (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error al actualizar detalle de pedido');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Detalle de pedido no encontrado');
        } else {
            res.send('Detalle de pedido actualizado correctamente');
        }
    });
});

// DELETE - Eliminar un detalle de pedido existente
app.delete('/detalle_pedidos/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM Detalle_Pedido WHERE ID_Detalle_Pedido = ?";
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error en la consulta: ", err);
            res.status(500).send('Error al eliminar detalle de pedido');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Detalle de pedido no encontrado');
        } else {
            res.send('Detalle de pedido eliminado correctamente');
        }
    });
});

