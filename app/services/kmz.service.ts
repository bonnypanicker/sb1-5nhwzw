import { File, Folder, knownFolders, path } from '@nativescript/core';
import { Location } from '../models/location.model';
import * as JSZip from 'jszip';

export class KmzService {
    private static parseKml(kmlContent: string): Location[] {
        const locations: Location[] = [];
        const placemarks = kmlContent.match(/<Placemark>[\s\S]*?<\/Placemark>/g) || [];

        placemarks.forEach((placemark, index) => {
            const nameMatch = placemark.match(/<name>(.*?)<\/name>/);
            const coordMatch = placemark.match(/<coordinates>(.*?)<\/coordinates>/);
            
            if (coordMatch && coordMatch[1]) {
                const [longitude, latitude] = coordMatch[1].split(',').map(Number);
                const name = nameMatch ? nameMatch[1] : `Location ${index + 1}`;
                const id = `ID${Date.now()}${index}`;

                locations.push({
                    id,
                    name,
                    latitude,
                    longitude
                });
            }
        });

        return locations;
    }

    static async processKmzFile(filePath: string): Promise<Location[]> {
        try {
            const file = File.fromPath(filePath);
            const fileData = file.readSync();
            
            const zip = new JSZip();
            const contents = await zip.loadAsync(fileData);
            
            // Find the .kml file in the archive
            const kmlFile = Object.values(contents.files).find(f => 
                f.name.toLowerCase().endsWith('.kml')
            );

            if (!kmlFile) {
                throw new Error('No KML file found in KMZ archive');
            }

            const kmlContent = await kmlFile.async('text');
            return this.parseKml(kmlContent);
        } catch (error) {
            console.error('Error processing KMZ file:', error);
            throw error;
        }
    }
}