import { Observable, File, Folder, knownFolders, path } from '@nativescript/core';
import { Location } from '../models/location.model';
import { KmzService } from './kmz.service';

export class LocationService extends Observable {
    private locations: Location[] = [];
    private dataFolder: Folder;

    constructor() {
        super();
        this.dataFolder = Folder.fromPath(
            path.join(knownFolders.documents().path, 'locationData')
        );
        this.loadLocations();
    }

    private loadLocations() {
        const dataFile = File.exists(
            path.join(this.dataFolder.path, 'locations.json')
        )
            ? File.fromPath(path.join(this.dataFolder.path, 'locations.json'))
            : null;

        if (dataFile) {
            try {
                const content = dataFile.readTextSync();
                this.locations = JSON.parse(content);
            } catch (error) {
                console.error('Error loading locations:', error);
                this.locations = [];
            }
        }
    }

    private saveLocations() {
        const dataFile = File.fromPath(
            path.join(this.dataFolder.path, 'locations.json')
        );
        dataFile.writeTextSync(JSON.stringify(this.locations), 'utf-8');
    }

    async importKmzFile(filePath: string): Promise<void> {
        try {
            const newLocations = await KmzService.processKmzFile(filePath);
            this.locations = [...this.locations, ...newLocations];
            this.saveLocations();
            this.notifyPropertyChange('locations', this.locations);
        } catch (error) {
            console.error('Error importing KMZ file:', error);
            throw error;
        }
    }

    addLocation(location: Location) {
        this.locations.push(location);
        this.saveLocations();
    }

    searchLocations(query: string): Location[] {
        if (!query) return [];
        
        query = query.toLowerCase();
        return this.locations.filter(location => 
            location.name.toLowerCase().includes(query) || 
            location.id.toLowerCase().includes(query)
        );
    }

    getAllLocations(): Location[] {
        return [...this.locations];
    }

    deleteLocation(id: string) {
        this.locations = this.locations.filter(loc => loc.id !== id);
        this.saveLocations();
    }

    // Add sample data for testing
    addSampleData() {
        this.locations = [
            { id: "1024074", name: "Kollam Tower 1", latitude: 8.8932, longitude: 76.6141 },
            { id: "1024075", name: "Kollam Tower 2", latitude: 8.8942, longitude: 76.6151 },
            { id: "1024076", name: "Kollam Central", latitude: 8.8867, longitude: 76.6191 }
        ];
        this.saveLocations();
    }
}