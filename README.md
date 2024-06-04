# SPI-Dev-Prod

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Node Version

This was tested on Node v14.17.0.  Other versions may work as well, but were not tested.

## Refer to the `.env-example` file in the root of this repository for the correct environment variables needed to run this app

## Available Scripts

In the project root, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000/protected](http://localhost:3000/protected) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

Runs a Node server serving up the static `build` directory.  This can be used for full end to end testing.

If not using AppID, please remove, or comment out, all references in `/server/index.js`.  They will be tagged with `// AppId` above and `//` below the code blocks.

Open [http://localhost:3000/protected](http://localhost:3000/protected) to view it in your browser.

## Docker Deployment

Use `docker` or `podman` to create a local image.

`<docker/podman> build -t <tagname> .`

The port the server uses will be `8443`.  You can then test by using the `run` command, and opening up the port locally.

`<docker/podman> run -p 8443:8443 <tagname> `

Open [http://localhost:8443/protected](http://localhost:8443/protected) to view it in your browser.

Then tag and push this image to an cloud image repository for deployment.

`<docker/podman> tag <tagname> <imagerepository/tagname>`

`<docker/podman> push <imagerepository/tagname>`

Note: Ensure you have the correct credentials to push to an cloud image repository.
