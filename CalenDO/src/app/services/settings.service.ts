import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface UserSettings {
  id?: number;
  theme: string;
  notification_enabled: boolean;
  calendar_view: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:8000/api/settings';
  
  private settingsSubject = new BehaviorSubject<UserSettings>({
    theme: 'light',
    notification_enabled: true,
    calendar_view: 'month'
  });
  
  public settings = this.settingsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load settings when user logs in
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadSettings();
      } else {
        // Reset to defaults when logged out
        this.settingsSubject.next({
          theme: 'light',
          notification_enabled: true,
          calendar_view: 'month'
        });
      }
    });
  }

  loadSettings(): void {
    if (this.authService.isLoggedIn) {
      this.http.get<UserSettings>(`${this.apiUrl}/my_settings/`)
        .subscribe(settings => {
          this.settingsSubject.next(settings);
        });
    }
  }

  updateSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/${settings.id}/`, settings)
      .pipe(
        tap(updatedSettings => {
          this.settingsSubject.next(updatedSettings);
        })
      );
  }

  // Convenience getters for specific settings
  get currentTheme(): string {
    return this.settingsSubject.value.theme;
  }

  get notificationsEnabled(): boolean {
    return this.settingsSubject.value.notification_enabled;
  }

  get calendarView(): string {
    return this.settingsSubject.value.calendar_view;
  }
}