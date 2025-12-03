import { ApiResponse, Fixer, Job, JobWithFixers } from '@/types/fixer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fixerService = {
  /**
   * Obtener todos los trabajos con sus fixers asociados
   */
  async getJobsWithFixers(): Promise<JobWithFixers[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/with-fixers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ApiResponse<JobWithFixers[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching jobs with fixers:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los trabajos
   */
  async getJobs(): Promise<Job[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ApiResponse<Job[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los fixers
   */
  async getFixers(): Promise<Fixer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/fixers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ApiResponse<Fixer[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching fixers:', error);
      throw error;
    }
  },

  /**
   * Obtener fixer por ID
   */
  async getFixerById(id: string): Promise<Fixer> {
    try {
      const response = await fetch(`${API_BASE_URL}/fixers/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ApiResponse<Fixer> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching fixer:', error);
      throw error;
    }
  },

  /**
   * Obtener fixers por tipo de trabajo
   */
  async getFixersByJobType(jobType: string): Promise<Fixer[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${jobType}/fixers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: ApiResponse<Fixer[]> = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching fixers by job type:', error);
      throw error;
    }
  },
};
