import { Application } from '@nativescript/core';
import { LocationService } from './services/location.service';

// Initialize services
const locationService = new LocationService();

Application.run({ moduleName: 'app-root' });