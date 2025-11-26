import { Platform } from 'react-native';

// Detecta se está na web
const isWeb = Platform.OS === 'web';

// Variável para SQLite (apenas mobile)
let db = null;

// ⚠️ CRÍTICO: Só importa e inicializa SQLite se NÃO for web
if (!isWeb) {
    // Usa require() ao invés de import para carregar dinamicamente
    const SQLite = require('expo-sqlite');
    db = SQLite.openDatabaseSync('sorteador.db');
    console.log('📱 SQLite inicializado (Mobile)');
} else {
    console.log('🌐 Web detectada - usando LocalStorage');
}

// ============ STORAGE WEB (LocalStorage) ============

const WebStorage = {
    getUsers: () => {
        try {
            const data = localStorage.getItem('users');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    setUsers: (users) => {
        localStorage.setItem('users', JSON.stringify(users));
    },

    getDraws: () => {
        try {
            const data = localStorage.getItem('draws');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    setDraws: (draws) => {
        localStorage.setItem('draws', JSON.stringify(draws));
    },
};

// ============ INICIALIZAR BANCO ============

export const initDatabase = async () => {
    if (isWeb) {
        console.log('🌐 Usando LocalStorage (Web)');
        return Promise.resolve();
    }

    console.log('📱 Inicializando SQLite (Mobile)');

    try {
        // Criar tabela de usuários
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabela users criada');

        // Criar tabela de sorteios
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS draws (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                min INTEGER NOT NULL,
                max INTEGER NOT NULL,
                historic TEXT,
                allow_repetition INTEGER DEFAULT 1,
                available_numbers TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
        console.log('✅ Tabela draws criada');

        return Promise.resolve();
    } catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
        return Promise.reject(error);
    }
};

// ============ FUNÇÕES DE USUÁRIO ============

export const createUser = async (name, email, password) => {
    // WEB: LocalStorage
    if (isWeb) {
        return new Promise((resolve, reject) => {
            const users = WebStorage.getUsers();

            if (users.find(u => u.email === email)) {
                reject({ success: false, error: 'Email já cadastrado' });
                return;
            }

            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                created_at: new Date().toISOString(),
            };

            users.push(newUser);
            WebStorage.setUsers(users);
            resolve({ success: true, userId: newUser.id });
        });
    }

    // MOBILE: SQLite - NOVA API
    try {
        const result = await db.runAsync(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, password]
        );
        return { success: true, userId: result.lastInsertRowId };
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return { success: false, error: 'Email já cadastrado' };
        }
        return { success: false, error: error.message };
    }
};

export const loginUser = async (email, password) => {
    // WEB: LocalStorage
    if (isWeb) {
        return new Promise((resolve, reject) => {
            const users = WebStorage.getUsers();
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                resolve({
                    success: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                });
            } else {
                reject({ success: false, error: 'Email ou senha incorretos' });
            }
        });
    }

    // MOBILE: SQLite - NOVA API
    try {
        const result = await db.getFirstAsync(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (result) {
            return {
                success: true,
                user: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                }
            };
        } else {
            return { success: false, error: 'Email ou senha incorretos' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// ============ FUNÇÕES DE SORTEIOS ============

export const createDraw = async (userId, drawData) => {
    // WEB: LocalStorage
    if (isWeb) {
        return new Promise((resolve) => {
            const draws = WebStorage.getDraws();
            const newDraw = {
                id: Date.now(),
                user_id: userId,
                name: drawData.name,
                min: drawData.min,
                max: drawData.max,
                historic: drawData.historic || [],
                allowRepetition: drawData.allowRepetition,
                availableNumbers: drawData.availableNumbers || [],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            draws.push(newDraw);
            WebStorage.setDraws(draws);
            resolve({ success: true, id: newDraw.id });
        });
    }

    // MOBILE: SQLite - NOVA API
    try {
        const { name, min, max, historic, allowRepetition, availableNumbers } = drawData;

        const result = await db.runAsync(
            `INSERT INTO draws (user_id, name, min, max, historic, allow_repetition, available_numbers, updated_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
            [
                userId,
                name,
                min,
                max,
                JSON.stringify(historic || []),
                allowRepetition ? 1 : 0,
                JSON.stringify(availableNumbers || [])
            ]
        );

        const params = [
            userId,
            drawData.name,
            drawData.min,
            drawData.max,
            JSON.stringify(drawData.historic || []),
            drawData.allowRepetition ? 1 : 0,
            JSON.stringify(drawData.availableNumbers || [])
        ];

        return { success: true, id: result.lastInsertRowId };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const getUserDraws = async (userId) => {
    // WEB: LocalStorage
    if (isWeb) {
        return new Promise((resolve) => {
            const allDraws = WebStorage.getDraws();
            const userDraws = allDraws
                .filter(d => d.user_id === userId)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                .map(draw => ({
                    id: draw.id,
                    name: draw.name,
                    min: draw.min,
                    max: draw.max,
                    historic: draw.historic || [],
                    allowRepetition: draw.allowRepetition,
                    availableNumbers: draw.availableNumbers || [],
                    createdAt: draw.created_at,
                    updatedAt: draw.updated_at,
                }));

            resolve({ success: true, draws: userDraws });
        });
    }

    // MOBILE: SQLite - NOVA API
    try {
        const result = await db.getAllAsync(
            'SELECT * FROM draws WHERE user_id = ? ORDER BY updated_at DESC',
            [userId]
        );

        const draws = result.map(draw => ({
            id: draw.id,
            name: draw.name,
            min: draw.min,
            max: draw.max,
            historic: JSON.parse(draw.historic || '[]'),
            allowRepetition: draw.allow_repetition === 1,
            availableNumbers: JSON.parse(draw.available_numbers || '[]'),
            createdAt: draw.created_at,
            updatedAt: draw.updated_at,
        }));

        return { success: true, draws };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const updateDraw = async (drawId, drawData) => {
    // WEB: LocalStorage
    if (isWeb) {
        return new Promise((resolve) => {
            const draws = WebStorage.getDraws();
            const index = draws.findIndex(d => d.id === drawId);

            if (index !== -1) {
                draws[index] = {
                    ...draws[index],
                    name: drawData.name,
                    min: drawData.min,
                    max: drawData.max,
                    historic: drawData.historic,
                    allowRepetition: drawData.allowRepetition,
                    availableNumbers: drawData.availableNumbers,
                    updated_at: new Date().toISOString(),
                };
                WebStorage.setDraws(draws);
            }

            resolve({ success: true });
        });
    }

    // MOBILE: SQLite - NOVA API
    try {
        const { name, min, max, historic, allowRepetition, availableNumbers } = drawData;

        await db.runAsync(
            `UPDATE draws 
             SET name = ?, min = ?, max = ?, historic = ?, allow_repetition = ?, 
                 available_numbers = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                name,
                min,
                max,
                JSON.stringify(historic || []),
                allowRepetition ? 1 : 0,
                JSON.stringify(availableNumbers || []),
                drawId
            ]
        );

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const deleteDraw = async (drawId) => {
    // WEB: LocalStorage
    if (isWeb) {
        return new Promise((resolve) => {
            const draws = WebStorage.getDraws();
            const filtered = draws.filter(d => d.id !== drawId);
            WebStorage.setDraws(filtered);
            resolve({ success: true });
        });
    }

    // MOBILE: SQLite - NOVA API
    try {
        await db.runAsync(
            'DELETE FROM draws WHERE id = ?',
            [drawId]
        );

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};