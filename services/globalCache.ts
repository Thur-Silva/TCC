import * as FileSystem from 'expo-file-system';

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function getDirectorySize(uri: string): Promise<number> {
    let total = 0;
    const info = await FileSystem.readDirectoryAsync(uri);
    for (const item of info) {
        const itemUri = uri + item;
        const itemInfo = await FileSystem.getInfoAsync(itemUri, { size: true });
        if (itemInfo.exists && itemInfo.isDirectory) {
            total += await getDirectorySize(itemUri + '/');
        } else if (itemInfo.exists && itemInfo.size) {
            total += itemInfo.size;
        }
    }
    return total;
}

async function getCacheSize(): Promise<string> {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return '0 KB';
    const total = await getDirectorySize(cacheDir);
    return formatBytes(total);
}

async function clearAllCache(): Promise<void> {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return;

    const entries = await FileSystem.readDirectoryAsync(cacheDir);
    for (const entry of entries) {
        const fullPath = cacheDir + entry;
        await FileSystem.deleteAsync(fullPath, { idempotent: true });
    }
}

export default {
    getCacheSize,
    clearAllCache,
};
