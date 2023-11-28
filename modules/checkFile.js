import fs from "node:fs/promises"


export const checkFile = async (path, createIfMissing) => {
  if (createIfMissing) {
    try {
      await fs.access(path);
    } catch (err) {
      await fs.writeFile(path, JSON.stringify([]));
      console.log('ERROR:',err )
      console.log(`Файл ${path} был создан!`)
      return true;
    }
  }

  try {
    await fs.access(path);
  } catch (err) {
    console.log('ERROR:',err )
    console.error(`Файл ${path} не найден!`)
    return false
  }
  return true
}