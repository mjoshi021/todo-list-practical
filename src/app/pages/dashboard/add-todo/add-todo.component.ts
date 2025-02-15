import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss']
})
export class AddTodoComponent {

  // Form group for managing the todo form
  reactiveForm: FormGroup;

  // Determines whether the component is in edit mode
  isEditMode: boolean = false;

  // Stores the ID of the todo item (used for editing)
  todoId: string = '';

  constructor(
    private formBuilder: FormBuilder, // Form builder for reactive forms
    private dashboardService: DashboardService, // Service for todo operations
    private router: Router, // Router for navigation
    public activatedRoute: ActivatedRoute, // Activated route to get query parameters
    private commonService: CommonService // Service for handling common functionalities like error messages
  ) {
    // Initialize the form with default values and validation rules
    this.reactiveForm = this.formBuilder.group({
      title: ['', Validators.required], // Title is required
      description: ['', Validators.required], // Description is required
      isCompleted: ['true'] // Default value for completion status
    });

    // Check if there is a query parameter "id" (for edit mode)
    this.activatedRoute.queryParams.subscribe(params => {
      this.todoId = params['id']; // Get the ID from query parameters
      this.isEditMode = !!this.todoId; // If an ID exists, set edit mode to true
    });
  }

  ngOnInit() {
    // If the component is in edit mode, fetch the existing todo data
    if (this.isEditMode) {
      this.getTodoData();
    }
  }

  /**
   * Navigates back to the dashboard page
   */
  onBackClick() {
    this.router.navigate(['pages/dashboard']);
  }

  /**
   * Fetches existing todo data if in edit mode
   */
  async getTodoData() {
    try {
      let result = await this.dashboardService.getTodosDetail(this.todoId);
      console.log(result);

      if (result) {
        // Populate form fields with existing data
        this.reactiveForm.patchValue({
          title: result.title,
          description: result.description,
          isCompleted: result.isCompleted
        });
      }
    } catch (error: any) {
      this.commonService.generateError(error); // Handle errors
    }
  }

  /**
   * Handles form validation errors
   * @param control - Form control name
   * @param error - Validation error type
   * @returns - True if the control has the specified error
   */
  public errorHandling = (control: string, error: string) => {
    return this.reactiveForm.controls[control].hasError(error);
  };

  /**
   * Handles saving (create or update) of todo item
   */
  async onSaveClick() {
    if (this.reactiveForm.valid) {
      try {
        let result;
        
        if (this.isEditMode) {
          // Update existing todo if in edit mode
          result = await this.dashboardService.updateTodo(this.todoId, this.reactiveForm.value);
        } else {
          // Create new todo if in add mode
          result = await this.dashboardService.createTodo(this.reactiveForm.value);
        }

        if (result) {
          let successMsg = this.isEditMode ? 'Data updated successfully!' : 'Data added successfully!'
          this.commonService.showSuccessToaster('Success', successMsg);
          this.router.navigate(['/pages/dashboard']); // Navigate back to dashboard after success
        }
      } catch (error: any) {
        this.commonService.generateError(error); // Handle errors
      }
    } else {
      // Mark all fields as touched if the form is invalid
      this.reactiveForm.markAllAsTouched();
    }
  }

  /**
   * Resets the form when the cancel button is clicked
   */
  onCancelClick() {
    this.reactiveForm.reset();
  }

}
