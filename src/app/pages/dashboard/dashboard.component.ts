import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilityService } from 'src/app/shared/services/utility.service';

// Define the Todo interface to structure the todo list data
interface Todo {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  // Variables for managing data and state
  dataLength: number = 0; // Stores the total number of todos
  selectedTodoId: string = ''; // Stores the selected todo ID
  displayedColumns: string[] = ['id', 'title', 'description', 'isCompleted', 'actions']; // Defines table columns
  dataSource = new MatTableDataSource<Todo>([]); // Holds the todo list data for the table
  isDataLoaded : boolean = false; // Boolean to check if data is loaded;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('deletePopup') deletePopup!: TemplateRef<any>; // ViewChild reference to delete confirmation popup

  constructor(
    public dashboardService: DashboardService, // Service to handle API calls for todos
    private commonService: CommonService, // Common service for handling errors and notifications
    private dialog: MatDialog, // MatDialog for modal dialogs
    private router: Router, // Router for navigation
    private utilityService: UtilityService
  ) { }

  // Lifecycle hook - runs when the component initializes
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getTodoListData(); // Fetches the todo list data when the component loads
  }

  // Navigates to the create-todo page when adding a new todo
  onAddClick() {
    this.router.navigate(['pages/dashboard/create-todo']);
  }

  // Navigates to the create-todo page with query parameters when editing a todo
  onEditClick(todoId: string) {
    this.router.navigate(['pages/dashboard/create-todo'], {
      queryParams: { id: todoId },
    });
  }

  // Opens a confirmation dialog before deleting a todo
  onDeleteConfirmation(id: string) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px', // Set modal width
      data: { id: id } // Pass the todo ID to the confirmation dialog
    });

    // After closing the dialog, refresh the todo list
    dialogRef.afterClosed().subscribe(result => {
      this.getTodoListData();
    });
  }

  /**
   * Fetches the todo list data from the service
   */
  async getTodoListData(): Promise<void> {
    try {
      this.isDataLoaded = false;
      let result = await this.dashboardService.getTodosList(); // Call service to get todos

      if (result?.length) {
        this.dataSource.data = result; // Update table data source
        this.dataSource.paginator = this.paginator;
        this.dataLength = result.length; // Update total todo count
      }
    } catch (error: any) {
      this.commonService.generateError(error); // Handle and display errors using common service
    } finally {
      this.isDataLoaded = true;
    }
  }

  logout() {
    this.utilityService.clearAllLocalStorageData()
    this.router.navigate(['/']);
  }
}
