const { pool } = require("../database");

const postRegister = async (request, response) => {
    try {
        const { name, last_name, email, photo, password } = request.body;

        // Validar que todos los campos estén presentes
        if (!name || !last_name || !email || !photo || !password) {
            return response.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Verificar si el usuario ya existe
        let sql = "SELECT * FROM user WHERE email = ?";
        let [existingUser ] = await pool.query(sql, [email]);

        if (existingUser .length > 0) {
            return response.status(400).json({ message: 'El usuario ya existe' });
        }

        // Insertar el nuevo usuario en la base de datos sin encriptar la contraseña
        sql = "INSERT INTO user (name, last_name, email, photo, password) VALUES (?, ?, ?, ?, ?)";
        let [result] = await pool.query(sql, [name, last_name, email, photo, password]); // Aquí se almacena la contraseña en texto plano

        // Verificar si la inserción fue exitosa
        if (result.insertId) {
            return response.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
        } else {
            return response.status(500).json({ message: 'Error al registrar el usuario' });
        }
    } catch (error) {
        console.error('Error en postRegister:', error);
        return response.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

const postLogin = async (request, response) => {
    try {
        const { email, password } = request.body;

        // Validar que se proporcionen el correo y la contraseña
        if (!email || !password) {
            return response.status(400).json({ message: 'Correo y contraseña son requeridos' });
        }

        // Buscar al usuario en la base de datos
        let sql = "SELECT * FROM user WHERE email = ?";
        let [users] = await pool.query(sql, [email]);

        if (users.length === 0) {
            return response.status(401).json({ message: 'Datos incorrectos' });
        }

        const user = users[0];

        // Comparar la contraseña proporcionada con la almacenada (sin encriptación)
        if (user.password !== password) {
            return response.status(401).json({ message: 'Datos incorrectos' });
        }

        // Retornar los datos del usuario sin la contraseña
        const { password: _, ...userData } = user; // Desestructuramos para eliminar la contraseña
        return response.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: userData,
        });
    } catch (error) {
        console.error('Error en postLogin:', error);
        return response.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

module.exports = { postRegister, postLogin };

// const { pool } = require("../database");
// const bcrypt = require('bcrypt'); // Para encriptar y comparar contraseñas

// const postRegister = async (request, response) => {
//     try {
//         const { name, last_name, email, photo, password } = request.body;

//         // Validar que todos los campos estén presentes
//         if (!name || !last_name || !email || !photo || !password) {
//             return response.status(400).json({ message: 'Todos los campos son obligatorios' });
//         }

//         // Verificar si el usuario ya existe
//         let sql = "SELECT * FROM user WHERE email = ?"; // Cambiado a 'user'
//         let [existingUser ] = await pool.query(sql, [email]);

//         if (existingUser .length > 0) {
//             return response.status(400).json({ message: 'El usuario ya existe' });
//         }

//         // Encriptar la contraseña
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insertar el nuevo usuario en la base de datos
//         sql = "INSERT INTO user (name, last_name, email, photo, password) VALUES (?, ?, ?, ?, ?)"; // Cambiado a 'user'
//         let [result] = await pool.query(sql, [name, last_name, email, photo, hashedPassword]);

//         // Verificar si la inserción fue exitosa
//         if (result.insertId) {
//             return response.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
//         } else {
//             return response.status(500).json({ message: 'Error al registrar el usuario' });
//         }
//     } catch (error) {
//         console.error('Error en postRegister:', error); // Imprimir el error en la consola
//         return response.status(500).json({ message: 'Error al registrar el usuario' });
//     }
// };

// const postLogin = async (request, response) => {
//     try {
//         const { email, password } = request.body;

//         // Validar que se proporcionen el correo y la contraseña
//         if (!email || !password) {
//             return response.status(400).json({ message: 'Correo y contraseña son requeridos' });
//         }

//         // Buscar al usuario en la base de datos
//         let sql = "SELECT * FROM user WHERE email = ?"; // Cambiado a 'user'
//         let [users] = await pool.query(sql, [email]);

//         if (users.length === 0) {
//             return response.status(401).json({ message: 'Datos incorrectos' });
//         }

//         const user = users[0];

//         // Comparar la contraseña proporcionada con la almacenada
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return response.status(401).json({ message: 'Datos incorrectos' });
//         }

//         // Retornar los datos del usuario sin la contraseña
//         const { password: _, ...userData } = user; // Desestructuramos para eliminar la contraseña
//         return response.status(200).json({
//             message: 'Inicio de sesión exitoso',
//             user: userData,
//         });
//     } catch (error) {
//         console.error('Error en postLogin:', error); // Imprimir el error en la consola
//         return response.status(500).json({ message: 'Error al iniciar sesión' });
//     }
// };

// module.exports = { postRegister, postLogin };