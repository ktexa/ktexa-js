# Quick Example
```
import ktexaClient from 'ktexa'

const ktexa = new KtexaClient({
  apiKey: 'your-api-key-here',
})

// Index an image
const imageFile = new File([''], 'image.jpg', { type: 'image/jpeg' })

const imageId = await ktexa.indexImage(imageFile, { tags: ['cat', 'cute'] })

// Search for similar images
const similarImages = await ktexa.searchImages(imageFile, 5)
```

The KtexaClient class is the main entry point for the SDK. It takes a KtexaConfig object as a constructor parameter, which includes the API key and an optional base URL.
The indexImage method allows users to index an image in the Ktexa service. It accepts an image as either a File or a base64-encoded string, and optional metadata. It returns a Promise that resolves to the indexed image's ID.
The searchImages method allows users to perform a reverse image search using the Ktexa service. It accepts an image as either a File or a base64-encoded string, and an optional limit for the number of similar images to return. It returns a Promise that resolves to an array of KtexaImage objects, which represent the similar images.
The dataURItoBlob method is a helper function that converts a base64-encoded string to a Blob object, which is required for the image upload.
The KtexaImage interface defines the structure of the response from the searchImages method.
