import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { Timestamp } from 'firebase/firestore';

export interface StudyDeck {
  id?: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const COLLECTION_NAME = 'studyDecks';

export const studyDeckService = {
  async createDeck(deck: Omit<StudyDeck, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const db = getFirebaseDb();
      const deckWithTimestamps = {
        ...deck,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, COLLECTION_NAME), deckWithTimestamps);
      return { ...deckWithTimestamps, id: docRef.id };
    } catch (error) {
      console.error('Error creating deck:', error);
      throw error;
    }
  },

  async getUserDecks(userId: string) {
    try {
      const db = getFirebaseDb();
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudyDeck[];
    } catch (error) {
      console.error('Error getting user decks:', error);
      throw error;
    }
  },

  async getDeck(deckId: string) {
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, COLLECTION_NAME, deckId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Study deck not found');
      }
      
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as StudyDeck;
    } catch (error) {
      console.error('Error getting deck:', error);
      throw error;
    }
  },

  async updateDeck(deckId: string, updates: Partial<StudyDeck>) {
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, COLLECTION_NAME, deckId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return this.getDeck(deckId);
    } catch (error) {
      console.error('Error updating deck:', error);
      throw error;
    }
  },

  async deleteDeck(deckId: string) {
    try {
      const db = getFirebaseDb();
      const deckRef = doc(db, COLLECTION_NAME, deckId);
      await deleteDoc(deckRef);
      return true;
    } catch (error) {
      console.error('Error deleting deck:', error);
      throw error;
    }
  }
};
