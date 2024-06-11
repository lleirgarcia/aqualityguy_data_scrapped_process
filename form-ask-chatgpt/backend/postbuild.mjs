import fs from "fs";
import path from "path";

const addJsExtension = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    console.log("\nfile: " + fullPath);
    if (fs.lstatSync(fullPath).isDirectory()) {
      addJsExtension(fullPath);
    } else if (path.extname(fullPath) === ".js") {
      let content = fs.readFileSync(fullPath, "utf8");
      content = content.replace(
        /(from\s+['"])(\.\/[^'"]+)(['"])/g,
        (match, p1, p2, p3) => {
          const importPath = path.resolve(path.dirname(fullPath), p2);
          const importExt = path.extname(importPath);
          return importExt === "" ? `${p1}${p2}.js${p3}` : match;
        }
      );
      fs.writeFileSync(fullPath, content, "utf8");
    }
  });
};

addJsExtension(path.join(process.cwd(), "dist"));
