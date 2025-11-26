import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Criar novo sorteio
export async function createDraw(userId, drawData) {
    try {
        const docRef = await addDoc(collection(db, 'draws'), {
            userId,
            name: drawData.name || 'Sorteio sem nome',
            min: drawData.min,
            max: drawData.max,
            historic: drawData.historic || [],
            allowRepetition: drawData.allowRepetition,
            availableNumbers: drawData.availableNumbers || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Erro ao criar sorteio:', error);
        return { success: false, error: error.message };
    }
}

// Buscar sorteios do usuário
export async function getUserDraws(userId) {
    try {
        const q = query(
            collection(db, 'draws'),
            where('userId', '==', userId),
            orderBy('updatedAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const draws = [];

        querySnapshot.forEach((doc) => {
            draws.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return { success: true, draws };
    } catch (error) {
        console.error('Erro ao buscar sorteios:', error);
        return { success: false, error: error.message };
    }
}

// Atualizar sorteio
export async function updateDraw(drawId, drawData) {
    try {
        const drawRef = doc(db, 'draws', drawId);
        await updateDoc(drawRef, {
            ...drawData,
            updatedAt: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar sorteio:', error);
        return { success: false, error: error.message };
    }
}

// Deletar sorteio
export async function deleteDraw(drawId) {
    try {
        await deleteDoc(doc(db, 'draws', drawId));
        return { success: true };
    } catch (error) {
        console.error('Erro ao deletar sorteio:', error);
        return { success: false, error: error.message };
    }
}