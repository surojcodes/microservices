## Three microservices in nodejs and typescript

- Two Nodejs REST APIS - account API and profile API in express and typescript
- Front facing graphQL API - bank API
  - uses Apollo Server and typescript with express
  - codegen for auto generated types
  - axios to communicate to REST APIs
  - proper project structure with separate schema files stitched together
- microservices communicates synchronously
- ingress NGINX as cluster entry
- HPA (Horizontal Pod Autoscaling) yml for all microservices
- deployments and services yml for all microservices

## In progress

- auth microservices (JWT Tokens)
