const fs = require('fs');
const path = require('path');

const modelsDir = './models/mariadb'; 

fs.readdir(modelsDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(modelsDir, file);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }

      // Add `sequelizePaginate` import at the top if it's not present
      if (!data.includes("sequelize-paginate")) {
        data = `const sequelizePaginate = require('sequelize-paginate');\n${data}`;
      }

      // Convert direct return to a variable assignment
      const defineRegex = /return sequelize\.define\(/;
      if (defineRegex.test(data)) {
        data = data.replace(defineRegex, `const model = sequelize.define(`);
      }

      // Ensure `sequelizePaginate.paginate(model);` is added before returning the model
      if (!data.includes("sequelizePaginate.paginate(model);")) {
        data = data.replace(/};\s*$/, `  sequelizePaginate.paginate(model);\n  return model;\n};`);
      }

      // Save the updated model file
      fs.writeFile(filePath, data, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${file}:`, err);
        } else {
          console.log(`Updated ${file}`);
        }
      });
    });
  });
});
