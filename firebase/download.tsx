// downloadFolder.js
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

export  const downloadFolder = async (folderPath: string | undefined) => {
  const storage = getStorage();
  const folderRef = ref(storage, folderPath);

  try {
    const folderContents = await listAll(folderRef);
    const urls = await Promise.all(
      folderContents.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return url;
      })
    );

    // Handle the URLs (e.g., download files, display links, etc.)
    console.log(urls);
  } catch (error) {
    console.error("Error downloading folder:", error);
  }
};

// Example usage