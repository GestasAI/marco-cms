/**
 * MARCO CMS - Academy Service
 * Gestiona la lógica de cursos, lecciones e interacción con la IA
 */

import { acideService } from '../acide/acideService';
import axios from 'axios';

class AcademyService {
    /**
     * Obtener curso por slug
     */
    async getCourseBySlug(slugOrId) {
        const courses = await acideService.list('academy_courses');
        return courses.find(c => c.slug === slugOrId || c.id === slugOrId) || null;
    }

    /**
     * Obtener lección por ID
     */
    async getLesson(id) {
        return await acideService.get('academy_lessons', id);
    }

    /**
     * Obtener progreso del alumno
     */
    async getStudentProgress(studentId, courseId) {
        const progress = await acideService.query('academy_progress', {
            where: [
                ['studentId', '==', studentId],
                ['courseId', '==', courseId]
            ]
        });
        return progress[0] || { completedLessons: [], unlockedResources: [], scores: {} };
    }

    /**
     * Actualizar progreso
     */
    async updateProgress(studentId, courseId, updates) {
        const existing = await this.getStudentProgress(studentId, courseId);
        if (existing.id) {
            return await acideService.update('academy_progress', existing.id, updates);
        } else {
            return await acideService.create('academy_progress', {
                id: `prog-${studentId}-${courseId}`,
                studentId,
                courseId,
                ...updates
            });
        }
    }

    /**
     * Chat con el Tutor IA (Hybrid AI Architecture)
     */
    async askTutor(lessonId, question, chatHistory = []) {
        const lesson = await this.getLesson(lessonId);
        if (!lesson) throw new Error('Lección no encontrada');

        const { aiService } = await import('./aiService');
        const response = await aiService.getResponse(question, lesson, chatHistory);

        return response;
    }
}

export default new AcademyService();
