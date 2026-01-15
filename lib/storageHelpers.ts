import { adminStorage } from './firebaseAdmin';

/**
 * Uploads a Base64 image to Firebase Storage
 * @param base64Image - Base64 encoded image string (with data:image prefix)
 * @param filePath - Path in storage bucket (e.g., 'barbers/barberId/profile.jpg')
 * @returns Public URL of the uploaded image
 */
export async function uploadImageToStorage(base64Image: string, filePath: string): Promise<string> {
    try {
        // Remove data:image/xxx;base64, prefix
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Get bucket and file reference
        const bucket = adminStorage.bucket();
        const file = bucket.file(filePath);

        // Upload the file
        await file.save(buffer, {
            metadata: {
                contentType: 'image/jpeg',
            },
            public: true, // Make the file publicly accessible
        });

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        return publicUrl;
    } catch (error: any) {
        console.error('Error uploading image to Storage:', error);
        console.error('Error details:', error.message, error.code);
        throw new Error(`Failed to upload image to Storage: ${error.message || 'Unknown error'}`);
    }
}

/**
 * Deletes an image from Firebase Storage
 * @param filePath - Path in storage bucket
 */
export async function deleteImageFromStorage(filePath: string): Promise<void> {
    try {
        const bucket = adminStorage.bucket();
        const file = bucket.file(filePath);
        await file.delete();
    } catch (error) {
        console.error('Error deleting image from Storage:', error);
        // Don't throw - deletion failures shouldn't block operations
    }
}

/**
 * Deletes all images for a barber (profile + portfolio)
 * @param barberId - The barber's document ID
 */
export async function deleteBarberImages(barberId: string): Promise<void> {
    try {
        const bucket = adminStorage.bucket();
        const folderPath = `barbers/${barberId}/`;

        // Delete all files in the barber's folder
        await bucket.deleteFiles({
            prefix: folderPath,
        });
    } catch (error) {
        console.error('Error deleting barber images:', error);
        // Don't throw - deletion failures shouldn't block operations
    }
}
