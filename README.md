# Muybridge Machine

Muybridge Machine is a web app that lets you import an image grid—ideally a motion-study or animation sequence—and instantly turn it into a GIF and individual frames. It’s a fast way to create motion graphics and social content without all the extra steps in Photoshop or After Effects.

## Live App

Use Muybridge Machine in your browser at **https://www.muybridgemachine.com/**.

## Features

- **Image upload**: Load any image from your computer (e.g., scanned film strips, contact sheets, sprite sheets, or motion studies).
- **Interactive grid**: Adjust horizontal and vertical boxes to match the number of frames in your motion sequence.
- **Region selection**: Draw and resize a selection box over the image to focus on a specific motion area.
- **Image sequence export**: Slice the selected region into individual frames at the image's original resolution and download them as a `.zip` archive.
- **GIF creation**: Automatically build an animated GIF from the extracted frames.
- **Animation preview**: Generate a simple animation from the frames for quick visual feedback.

## How to Use

1. **Open the app**
   - Go to **https://www.muybridgemachine.com/** in your browser.

2. **Upload your image grid**
   - Click the **Upload Image** card and choose an image that contains a motion-study, sprite sheet, or any grid-based animation sequence.

3. **Set the grid**
   - In **Grid Settings**, set the number of **Horizontal Boxes** and **Vertical Boxes** to match the layout of your image grid.

4. **Adjust the selection**
   - Use the selection box on the image preview to focus on the region that contains the motion sequence you care about.

5. **Generate outputs**
   - **Generate Image Sequence**: slices the selected area into individual frames and downloads them as a `.zip`.
   - **Create GIF**: builds an animated GIF from the frames and downloads it.
   - **Generate Animation**: previews a simple animation in the browser.

6. **Iterate**
   - Adjust the grid or selection and regenerate GIFs or frame sequences until you like the result.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

4. Upload an image with sequential motion, adjust the grid, draw your selection, and generate either an image sequence, GIF, or animation.

## Tech Stack

- **React** for the UI
- **Canvas** APIs for drawing, selection, and slicing frames
- **gifshot** for GIF generation
- **JSZip** for packaging frame sequences as a downloadable archive

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
