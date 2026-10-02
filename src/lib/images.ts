export const getOptimizedUrl = (url: string) => {
    if (url.includes("unsplash.com")) {
        // Forzamos ancho de 600px, formato webp y calidad 80
        return `${url.split('?')[0]}?auto=format&fit=crop&w=600&q=80`;
    }
    if (url.includes("freepik.com")) {
        // Si la URL permite parámetros, puedes ajustarlos aquí
        return url;
    }
    return url;
};