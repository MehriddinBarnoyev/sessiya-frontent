
// Application-wide constants

// Districts used for venue selection
export const DISTRICTS = [
  "Olmaliq", "Bekobod", "Chirchiq", "Yangiyo'l", "Bo'ka", "Zangiota",
  "Parkent", "Ohangaron", "Qibray", "Quyichirchiq", "Yuqorichirchiq", "Piskent", "Bo'stonliq"
];

// Venue status options
export const VENUE_STATUSES = ["Confirmed", "Unconfirmed"];

// Image upload restrictions
export const MAX_IMAGES = 10;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// API base URL
export const API_BASE_URL = "http://localhost:5000/api";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;
