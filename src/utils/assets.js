const assets = import.meta.glob(
    '../assets/**/*.*',
    { eager: true, import: 'default' }
);

export const resolveAsset = (relativePath) => assets[`../assets/${relativePath}`];
