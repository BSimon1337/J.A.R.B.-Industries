import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SettingsService, UserSettings } from '../services/settings.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    theme: 'light',
    notification_enabled: true,
    calendar_view: 'month'
  };
  
  successMessage: string = '';
  errorMessage: string = '';
  isSaving: boolean = false;
  
  themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'blue', label: 'Blue' }
  ];
  
  calendarViews = [
    { value: 'month', label: 'Month' },
    { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' }
  ];

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.settingsService.settings.subscribe(settings => {
      if (settings) {
        this.settings = { ...settings };
      }
    });
  }

  saveSettings(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSaving = true;
    
    this.settingsService.updateSettings(this.settings)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Settings saved successfully!';
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = 'Failed to save settings. Please try again.';
          console.error('Settings update error:', error);
        }
      });
  }
  
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}