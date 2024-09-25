import { promises as fs } from 'fs';
import { resolve } from 'path';

export async function deletePath(path: string): Promise<void> {
    try {
        const resolvedPath = resolve(path);

        const stat = await fs.stat(resolvedPath);

        if (stat.isDirectory()) {
            await fs.rmdir(resolvedPath, { recursive: true });
            console.log(`File ${resolvedPath} deleted.`);
        } else {
            await fs.unlink(resolvedPath);
            console.log(`File ${resolvedPath} deleted.`);
        }
    } catch (error) {
        console.error(`Error borrando el path: ${error}`);
    }
}
