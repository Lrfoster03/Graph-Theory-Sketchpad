This was a Sketchpad web application that I created based on the Facebook / Meta react framework. It is heavily reliant on said framework as well as some open source react imports. This organization / repository is soley so I can host it on Github Pages. If you want to take a look at it, you can find it [here][sketchpad].

<!-- To compile our app, we can run ```npm run build``` and to deploy we run ```npm run deploy```. This will route properly to the correct webpage. Then you can push up to git accordingly.-->

**<u>Implementation:</u>**

Implementation of my Sketchpad began with downloading the Facebook/Meta React Application. I chose to use a react application for a few reasons. React is an open-source application provided by Facebook/Meta that is open source and greatly used. There is a great amount of documentation available as well as community wide support. React works by packing website files and sending them to the client in a browser to function. This past summer, I had developed an extremely similar application with this very same concept and I was able to quickly adapt to the quirks of the react framework. To begin, I had to install all the newest installs of Node.js and the npm dependencies. The application creates a local server that runs natively on the user’s computer via the local port 3000, parsing website files through the local server to a client. You can access this server by going to a web browser, and simply typing in localhost:3000. This connects you to the client and loads the packets sent by the server. From there the application essentially functions like a website, allowing me to create specific aspects of the app from scratch using website languages such as JavaScript and CSS. I utilized an array data structure for keeping track the edges and vertices respectively. Each time a new vertex was created, it would be added to the array of vertices. I had the same implementation for edges. This allowed me to easily keep track of the vertices and edges, and when selected, would immediately point to the specific edge or vertex in the array. 

When adding objects to the webpage, each one would function as their own individual object allowing me to indicate a position and color without standardizing it for all variants of the same object on the page. I took great advantage of a lot of the react framework as well as the open source imports that are provided by Facebook/Meta and the community. Two such imports that I used was the react-bootstrap/Buttons import (available here: https://react-bootstrap.github.io/components/buttons/) and the react-color import (available here: https://www.npmjs.com/package/react-color). Both of which significantly helped with the implantation of my project. The buttons allowed me to easily indicate what state I wanted to be in when using the app, and the color made it simple and easy to visualize what color the user was choosing, as well as showcasing some preset standards. 

<u>Vertices:</u> Creating vertices, we’re relatively simple. Initially all I needed to do was display a dot on the screen of my application, but integrating it in with edges we’re a little more difficult. The vertices also needed to be able to be moved around when I chose. I used a common JavaScript process known as mouse down and ClickAction. These detect when I mouse over objects or click onto them, and when used in conjunction allowed me to move the vertices around the webpage. 

<u>Edges:</u> Edges caused me a little more trouble. They required getting the vertices position and assigning a start and ending vertex. I had to calculate the distance, magnitude, and direction based off the given vertices provided. Within the code I have an (x1, y1) and (x2, y2) provided for each vertex. This also allowed me to easily implement directed edges more seamlessly. 

<u>Directed Edges:</u> With directed edges, I decided to utilize the prewritten code I had in place for edges before I began. When I select the add directed edge state, I essentially just add a new arrow to the edge in the same direction. I have encountered issues with this however, in that when creating loops, it appears to bug out and showcase the arrow being significantly larger than it should be. That being said, the parallel functionality does still work with them properly, as adding another loop will create an even larger loop. Another issue I had with the arrow specifically is with coloring. When attempting to change the color of the directed edge, the first arrow changes correctly but if there are more than one then they too will change to whatever color the first directed edge placed down is. It’s a strange issue that I haven’t been able to troubleshoot thus far. 

<u>Delete:</u> My delete functionality is rather simple. When the delete state is selected, it will delete whatever the ClickAction file in my code returns. 

<u>Color:</u> As stated previously, implanting the ability to adjust the color of each of the objects in the sketchpad was greatly aided by the react-color color picker. It easily allowed me to choose the shape, intricacy, and color I would want to select. It even allows the user to enter their own RBG or Hex value for a color. There appears to be a selector to help with opacity, however that does appear to be bugged in my application. I’m unsure if this is a bug with the react-color color picker or my implantation of the color picker.

<u>Number of Vertices, Edges, and components:</u> In the top left corner of my application, you see a box with the number of edges, vertices, and components. The first two of these values come from what I mentioned earlier regarding the arrays with each vertex and edge. All I simply need to do to calculate these fields is to determine the length of the array. Calculating components is significantly more tricky. I start with whatever the length of my vertex array is, and from there I subtract depending on if each vertex is conjoined with an edge where the starting and ending vertex values aren’t the same. This way I can accurately avoid loops in the output and if all vertices are connected, then the outcome will be 1, not zero. 



**<u> Getting Started:</u>**

Upon download of my Graph Theorist’s Sketchpad Zip file, there will be a few things that are necessary to download prior to start up. The application is based off the Facebook / Meta React Application framework and requires the latest install of Node.js and npm to run. You can see more about the installation process here: https://github.com/facebook/create-react-app#creating-an-app. When all is installed, you can run the following commands within my Graph Theorist’s Sketchpad folder to run my application: 

```json

    $ cd graph-theory-sketchpad
    $ npm install
    $ npm start
```

<u>Note:</u> YOU MUST CD INTO THE PROPER DIRECTORY (I.E., the lowercase graph-theory-sketchpad folder). If you do not, and attempt to start the application, it will throw lots of errors. It is also possible that I missed parts of the install process here. When building my app I had to jump through lots of hoops in-order to properly import in all the code necessary. 

I should specify, this application was developed using my 2018 MacBook Pro running macOS Monterey 12.6. I have not tested this application on a Windows environment. It should run properly but if it does not, then it may require further troubleshooting that I am not aware of. 

The npm install command should install all exterior files and imports. Running the npm start command will start the application. After a few seconds, this will start the app and run it via a local server on the port 3000. The application should open automatically in your default browser, however if it does not, most modern browsers will run it (Microsoft Edge, Google Chrome, Firefox, or Safari), You can them type in in localhost:3000 into the search bar and my application will connect and begin running. You can stop running the application by entering CTRL + C into the terminal. The application may ask if you would like to terminate the job. Type y and the app should stop running. You can run npm start again if you would like to relaunch the app. 


**<u> Bugs / Trouble I had:</u>**

Due to the application being a web app, one bug / feature is when reloading the page, all the objects that we’re on the page previously are reset and the application restarts to its default states. This is due to the application being a webpage. Every time the page is refreshed, it reconnects to the server and removes the old client. I view this as a positive feature however as it allows users of the application to easily delete and start over their work. 

<u>Loops:</u> In my implantation of loops, I failed to consider how the geometry would affect them. Because of this, all loops when added to a vertex seemingly point in the same direction. The parallel edges does this as well. It also doesn’t matter which vertex, where it is located, or if It already has edges or not. 
	
<u>Directed Edges:</u> I mentioned in the implementation aspect of this paper how my directed edges are less than perfect. I have two such bugs with them. The first one is with loops. When I have a loop with a directed edge, the loop appears significantly wider than necessary, and in turn creates this strange blob on the screen. If I add more loops to the vertex, then my parallel edges continues out the blob format. I’m unsure what the reasoning behind this bug but I suspect it is because of the implementation I did to indicate the direction of the edge. 
My next bug with directed edges is with color. When selecting the color of the directed edge, the edge itself changes color but the arrow indicating direction will only change to whatever the first directed edge’s color is. If there are multiple directed edges, and I change the color of the first one, then the second directed edges’ arrow will change to whatever color the first directed edge is, while the line of the second directed edge stays whatever color it was initially. Once again, I believe this has to do with the way I implemented the arrow indicating direction for the directed edge, and am unsure of the cause. 

<u>Color Picker:</u> As mentioned previously, the color picker that I implemented was based off the react-color import, and as such made the color picking process significantly easier. One bug that I did notice with the color picker that I used however was the ability to implement opacity with the colors. There is an option for it on the color picker, however it refuses to adjust from 100. I am unaware if this is a bug with my implementation or a bug with the import. 

[sketchpad]: https://www.logoas.xyz/Graph-Theory-Sketchpad/
