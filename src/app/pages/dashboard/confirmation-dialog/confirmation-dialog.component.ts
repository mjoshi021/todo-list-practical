import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/shared/services/common.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  // Stores the ID of the todo item to be deleted
  todoId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject data passed from the dialog opening
    private dashboardService: DashboardService, // Service for managing todo-related API calls
    private commonService: CommonService // Service for handling common utilities like error messages
  ) {
    // Extract the ID of the todo item from the injected data
    this.todoId = data.id;
  }

  /**
   * Handles the delete action when the user confirms deletion.
   * Calls the deleteTodo method from the DashboardService.
   */
  async onDeleteClick() {
    try {
      let result = await this.dashboardService.deleteTodo(this.todoId); // Call API to delete the todo
      if(result){
        this.commonService.showSuccessToaster('Success', 'Data deleted Successfully!');
      }
      // You might want to close the dialog or refresh the list after successful deletion.
    } catch (error: any) {
      this.commonService.generateError(error); // Handle errors using the common service
    }
  }
}

