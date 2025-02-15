import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/app-config';
import { ApiInterfaceServices } from './api-interface.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiInterfaceServices) {}

  /**
   * Get Todo list data
   */
  async getTodosList() {
    try {
      const result = await (<any>(
        this.apiService
          .get('todos', true)
          .toPromise()
      ));
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Get Todo detail by id
   * @param id id of todo
   */
  async getTodosDetail(id: string) {
    try {
      const result = await (<any>(
        this.apiService
          .get('todos/' + id, true)
          .toPromise()
      ));
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Create Todo record
   * @param obj data of todo
   */
  async createTodo(obj: any) {
    try {
      const result = await (<any>(
        this.apiService
          .post('todos',obj, true)
          .toPromise()
      ));
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Update Todo record
   * @param id id of todo
   * @param obj data user want to update of todo
   */
  async updateTodo(id: string, obj: any) {
    try {
      const result = await (<any>(
        this.apiService
          .put('todos/' + id, obj, true)
          .toPromise()
      ));
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Delete todo data
   * @param id id of todo want to be deleted
   */
  async deleteTodo(id: string) {
    try {
      const result = await (<any>(
        this.apiService
          .delete('todos/' + id, true)
          .toPromise()
      ));
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

}
