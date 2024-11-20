import { Observable, Utils, File, knownFolders, path } from '@nativescript/core';
import { LocationService } from './services/location.service';
import * as filePickerModule from "@nativescript/core/file-system";

export class MainViewModel extends Observable {
    private locationService: LocationService;
    private _searchQuery: string = '';
    private _searchResults: any[] = [];

    constructor() {
        super();
        this.locationService = new LocationService();
    }

    get searchQuery(): string {
        return this._searchQuery;
    }

    set searchQuery(value: string) {
        if (this._searchQuery !== value) {
            this._searchQuery = value;
            this.notifyPropertyChange('searchQuery', value);
        }
    }

    get searchResults(): any[] {
        return this._searchResults;
    }

    set searchResults(value: any[]) {
        if (this._searchResults !== value) {
            this._searchResults = value;
            this.notifyPropertyChange('searchResults', value);
        }
    }

    async onImportKmz() {
        try {
            // In a real device, this would use a file picker
            // For demo, we'll use a sample KMZ file in the app's documents folder
            const documents = knownFolders.documents();
            const sampleKmzPath = path.join(documents.path, 'sample.kmz');
            
            await this.locationService.importKmzFile(sampleKmzPath);
            this.performSearch();
        } catch (error) {
            console.error('Error importing KMZ:', error);
            // Show error dialog to user
        }
    }

    onSearchTextChanged(args: any) {
        this.searchQuery = args.object.text;
        this.performSearch();
    }

    onSearch() {
        this.performSearch();
    }

    onAddSampleData() {
        this.locationService.addSampleData();
        this.performSearch();
    }

    onDeleteLocation(args: any) {
        const location = this.searchResults[args.object.bindingContext.index];
        this.locationService.deleteLocation(location.id);
        this.performSearch();
    }

    private performSearch() {
        if (this.searchQuery) {
            this.searchResults = this.locationService.searchLocations(this.searchQuery);
        } else {
            this.searchResults = this.locationService.getAllLocations();
        }
    }

    onLocationTap(args: any) {
        const location = this.searchResults[args.index];
        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        Utils.openUrl(url);
    }
}