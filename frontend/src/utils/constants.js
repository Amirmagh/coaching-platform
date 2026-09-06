/**
 * App-wide constants for the coaching platform frontend.
 */

// Goal / session status values, shared across services & UI.
export const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// GROW model phases used to drive the coaching question flow.
export const GROW_PHASES = {
  GOAL: 'goal',
  REALITY: 'reality',
  OPTIONS: 'options',
  WILL: 'will',
};

// Supported UI languages.
export const LANGUAGES = {
  FA: 'fa',
  EN: 'en',
};

export const DEFAULT_LANGUAGE = LANGUAGES.FA;

// LocalStorage keys, kept in one place to avoid typos across the app.
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  LANGUAGE: 'app_language',
  THEME: 'app_theme',
};

// Password rules used by validators.js and forms.
export const PASSWORD_MIN_LENGTH = 8;

// Iran crisis / emergency resources shown in the coaching chat.
export const CRISIS_RESOURCES_IR = [
  { label: 'کمیته امداد', phone: '1480' },
  { label: 'اورژانس', phone: '115' },
  { label: 'مشاوره روانی', phone: '123' },
];
