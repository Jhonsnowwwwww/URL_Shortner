# URL Shortener Application  

## Architecture Overview  

The URL Shortener Application is designed to provide users with a simple interface for shortening long URLs. This application follows a client-server architecture, where the frontend interacts with backend services through an API. The backend is implemented using AWS services, enabling a scalable and cost-effective solution.  

### Components:  
- **Frontend**:   
  - Built with React for a responsive user interface.  
  - Users can enter long URLs which are shortened by the backend.  
  
- **Backend**:  
  - **API Gateway**: Manages incoming HTTP requests and routes them to the appropriate AWS Lambda functions.  
  - **Lambda Functions**: Handles the core logic of URL shortening, including database interactions.  
  - **DynamoDB**: A NoSQL database to store the original long URLs and their shortened counterparts.  
  - **S3**: (Optional) To serve any static assets if needed in the future.  

### Open-Source Technologies Used  
- **React**: For building the user interface.  
- **AWS SDK**: For interacting with AWS services.  
- **Serverless Framework**: Facilitates the deployment and management of AWS Lambda functions and resources.  

## Acknowledgments  
- This project leverages various open-source technologies, including React and the Serverless framework, which have been instrumental in building and deploying the application effectively.  

## Local Development  
To run the application locally, clone the repository and follow the setup instructions in `setup.md`.
