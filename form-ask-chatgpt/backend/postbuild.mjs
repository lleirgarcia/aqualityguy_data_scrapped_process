import fs from 'fs';
import path from 'path';

// Función para recorrer directorios y modificar archivos
const addJsExtension = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    
    if (fs.lstatSync(fullPath).isDirectory()) {
      // Llamada recursiva para subdirectorios
      addJsExtension(fullPath);
    } else if (path.extname(fullPath) === ".js") {
      let content = fs.readFileSync(fullPath, "utf8");

      // Actualizar importaciones y exportaciones
      content = content.replace(/(from\s+['"])(\.\/[^'"]+)(['"])/g, (match, p1, p2, p3) => {
        const importPath = path.resolve(path.dirname(fullPath), p2);
        const importExt = path.extname(importPath);
        const baseName = path.basename(importPath);

        // Excluir rutas específicas de la adición de extensión .js
        if (baseName === 'uploads') {
          return match; // No añadir .js a 'uploads'
        }

        return importExt === "" ? `${p1}${p2}.js${p3}` : match;
      });

      // Actualizar importaciones dinámicas
      content = content.replace(/(import\(['"])(\.\/[^'"]+)(['"]\))/g, (match, p1, p2, p3) => {
        const importPath = path.resolve(path.dirname(fullPath), p2);
        const importExt = path.extname(importPath);
        const baseName = path.basename(importPath);

        // Excluir rutas específicas de la adición de extensión .js
        if (baseName === 'uploads') {
          return match; // No añadir .js a 'uploads'
        }

        return importExt === "" ? `${p1}${p2}.js${p3}` : match;
      });

      // Asegurar que todos los imports relativos se actualicen
      content = content.replace(/(import\s+[\s\S]*?['"])(\.\.\/[^'"]+)(['"])/g, (match, p1, p2, p3) => {
        const importPath = path.resolve(path.dirname(fullPath), p2);
        const importExt = path.extname(importPath);
        const baseName = path.basename(importPath);

        // Excluir rutas específicas de la adición de extensión .js
        if (baseName === 'uploads') {
          return match; // No añadir .js a 'uploads'
        }

        return importExt === "" ? `${p1}${p2}.js${p3}` : match;
      });

      fs.writeFileSync(fullPath, content, "utf8");
    }
  });
};

// Ruta del directorio dist
const distPath = path.join(process.cwd(), "dist");

// Ejecutar la función para modificar los archivos
addJsExtension(distPath);
